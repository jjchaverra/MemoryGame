;(function($) {
 
    $.MemoryGame = function(element, options, callback) {
		
		//Variables por defecto
        var defaults = {
            boxOpened   : '',
			imgOpened   : '',
			count       : 0,
			found       : 0,
			findCounter : 0,
			maxClick    : 0,
			data        : null,
			onShowFinish:false,
			isHappy:false,
        };
		
		//Métodos por defecto
		var methods = {
			onSelect : function() {
            
			},
			onFinished  : function() {
				setTimeout(function() {
					$element.find("img").show();
				}, 400)
			}
        }
 
		//
        var widget      = this; 
        widget.settings = {};
		widget.callback = {}

		var $element    = $(element);
	
		//Método que inicializa los elementos del plugin
        widget.init = function() {
            widget.settings = $.extend({}, defaults, options)
			widget.settings.findCounter = widget.settings.data.length;
			
			widget.callback = $.extend({}, methods, callback);

			addHtml();
			$element.find("img").hide();
			$element.find("div").click(openCard);

			shuffle();
        }
 
		//Agrega las imágenes al elemento seleccionado
        var addHtml = function() {			
			length = widget.settings.data.length;
			$.each(widget.settings.data, function(key, value) {
				key ++;
				$element.append("<div class='card"+key+"'><img src='"+value+"'/></div>");
				$element.append("<div class='card"+(key+length)+"'><img src='"+value+"' id='1'/></div>");
			});
        }
		
		//
		var openCard = function() {
            id = $(this).attr("class");
			if ($element.find("."+id+" img").is(":hidden")) {
				$element.find("div").unbind("click", openCard);

				$element.find("."+id+" img").slideDown('fast');

				if (widget.settings.imgOpened == "") {
					widget.settings.boxOpened = id;
					widget.settings.imgOpened = $element.find("."+id+" img").attr("src");
					setTimeout(function() {
						$element.find("div").bind("click", openCard)
					}, 300);

				} else {
					currentopened = $element.find("."+id+" img").attr("src");
					if (widget.settings.imgOpened != currentopened) {
						// close again
						setTimeout(function() {
							$element.find("."+id+" img").slideUp('fast');
							$element.find("."+widget.settings.boxOpened+" img").slideUp('fast');
							widget.settings.boxOpened = "";
							widget.settings.imgOpened = "";
						}, 400);

					} else {
						// defaults.found
						$element.find("."+id+" img").addClass("opacity");
						$element.find("."+widget.settings.boxOpened+" img").addClass("opacity");
						widget.settings.found++;
						widget.settings.boxOpened = "";
						widget.settings.imgOpened = "";
					}
					
					setTimeout(function() {
						$element.find("div").bind("click", openCard)
					}, 400);
				}

				widget.settings.count++;

				//Llamamos a la funcion onSelect
				widget.callback.onSelect.call(this);
				
				//Si llego al limite de click
				if(widget.settings.maxClick > 0 && widget.settings.maxClick == widget.settings.count){
					setTimeout(function() {
						finish();
					}, 300);
				}

				//Si completo de armar las parejas
				if (widget.settings.found == widget.settings.findCounter) {
					widget.settings.isHappy = true;
					finish();
				}
			}
        }
		
		//
		var shuffle = function(){
			var children = $element.children();
			var child    = $element.find("div:first-child");

			var array_img = new Array();
			for (i=0; i<children.length; i++) {
				array_img[i] = $("."+child.attr("class")+" img").attr("src");
				child = child.next();
			}

			var child = $element.find("div:first-child");
			for (z=0; z<children.length; z++) {
				randIndex = randomFromTo(0, array_img.length - 1);

				// set new image
				$("."+child.attr("class")+" img").attr("src", array_img[randIndex]);
				array_img.splice(randIndex, 1);

				child = child.next();
			}
		}
		
		//
		var randomFromTo = function(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        }
		
		//
		var finish = function(){
			if(widget.settings.onShowFinish){
				setTimeout(function() {
					$element.find("img").show();
					widget.callback.onFinished.call(this);
				}, 100)
			}else{
				widget.callback.onFinished.call(this);
			}
		}

		//
		widget.resetGame = function() {
            shuffle();

			$element.find("img").hide();
			$element.find("img").removeClass("opacity");

			widget.settings.count = 0;
			widget.settings.boxOpened = "";
			widget.settings.imgOpened = "";
			widget.settings.found = 0;

			return false;
        }
		
		//
        widget.init();
    }
 
	//
    $.fn.MemoryGame = function(options, callback) { 
        return this.each(function() {
            if (undefined == $(this).data('MemoryGame')) {
                var widget = new $.MemoryGame(this, options, callback);
                $(this).data('MemoryGame', widget);
            }
        });
    }

})(jQuery);