

$.widget('ly.svInput', {
    options: {
        items: {            
            target: "", // where to send the input for validation
            key: "",    // additional identifier sent to target
            enabled: true,   // enables/disables segment inputs
            segments: [], // the segments!
            dftype: "N",  // the default type used when not specified in segment -- HardSeparatorType "-", NumericInputType "N", AlphanumericInputType "A", ValidatedInputType "V"
            dflength: 5 //the default maxLength used when all other efforts fail
            //and more?
        }
    },
    _destroy: function () {
        this.element.show();
        this.element.unbind('click');
        //unhide?
    },
    _create: function () {
        var svI = this;
        var originalInput = this.element, originalName = originalInput.attr("name");
        if (typeof originalName == "undefined") { originalName = originalInput.attr("id"); }

        var inputTemplate = "<input class='ly-svInput'></input>";
        var workingSegment;
        
        var segregN = /\d/;  //numeric regex
        var segregA = /\w/g; //alphanumeric regex
        var segregV = /\w/g; //validated regex

        for (var i = 0; i < svI.options.segments.length; i++) {
            var Seg = svI.options.segments[i];
            var segType = Seg.type;
            var segLength = Seg.maxLength, segMax = Seg.max, segMin = Seg.min;
            var segHint = Seg.hint;
            if (typeof segLength == "undefined") {
                if (typeof segMax == "undefined") {
                    if (typeof segMin == "undefined") {
                        segLength = svI.options.dflength;
                    } else {
                        segLength = segMin.toString().length;
                    }
                } else {
                    segLength = segMax.toString().length;
                }
            }
            if (typeof segHint == "undefined") { segHint = ""; }

            if (typeof segType == "undefined") { segType = svI.options.dftype; }
            if (segType == "A" || segType == "N" || segType == "V") {
                workingSegment = $(inputTemplate).addClass("ly-sv" + segType)
                    .attr("id", originalName + "_i" + i)
                    .attr("maxlength", segLength)
                    .attr("size", segLength)
                    .attr("placeholder", segHint)
                    .attr("title", segHint);

                if (typeof Seg.regex != "undefined") {
                    workingSegment.data("pattern", Seg.regex);
                } else {
                    var segReg = "";
                    if (segType == "N") { segReg = segregN; }
                    if (segType == "A") { segReg = segregA; }
                    if (segType == "V") { segReg = segregV; }
                    workingSegment.data("pattern", segReg);
                }

                    originalInput.before(workingSegment);                
            }
            else if (segType == "-") {
                workingSegment = $("<span class='ly-svInput ly-separator'>" + segHint + "</span>");
                originalInput.before(workingSegment);
            }
            else {
                console.log(segType + " is not a valid input segment type");
            }
        }

        originalInput.hide();

        var si = $("input.ly-svInput");

        si.blur(function () {
            var $this = $(this);
            var pat = new RegExp($this.data("pattern"));
            var isValid = false;

            if ($this.val().match(pat) != null) {
                if ($this.val().length == $this.val().match(pat).length)
                { isValid = true; }
                else { isValid = false; }
            }
            $("#RepVal").text(isValid); //temporary measure!

            if (!isValid) {
                $this.addClass("ly-svInvalid");
            }
        });
    }


});
//////

//(function ($)
//{		//segment types
//    function HardSeparatorType(definition) //a non-mutable string
//	{
//		this.length = definition.length;
//        this.getUserInput = function ()
//        {
//            return definition;
//        };
//        this.getReg = function ()
//        {
//            return definition;
//        };
//        this.getValue = function ()
//        {
//            return definition;
//        };

//        this.addUserInput = function (){};
//		this.setUserInput = function (){};
//        this.increment = function (){};
//        this.decrement = function (){};       
		
//        this.accepts = function ()
//        {
//            return false;
//        };
		
//        this.isUserInputExplicit = function()
//        {
//            return true;
//        };
		
//        this.skip = true;
//    }
	
//	function NumericInputType(definition, callbacks) //Must be a number
//    {
//        var userInput = "";
//		if (typeof definition.maxLength != "undefined") 
//		{ this.length = definition.maxLength; }
//		else if (typeof definition.Max != "undefined" && typeof definition.Min != "undefined")
//		{
//		this.length = Math.max((definition.Min + "").length, (definition.Max + "").length);
//		}
//		else { this.length = 0; }	
       
//        this.skip = false;
//        this.getReg = function ()
//        {
//            return "[0-9]{" + this.length + "}";
//        };
//        this.setUserInput = function (val)
//        {
//            userInput = val
//        };
//        this.getUserInput = function ()
//        {
//            return definition;
//        };
//        this.getValue = function ()
//        {
//            return ("0000" + userInput).slice(-this.length);
//        };

//        this.accepts = function (character)
//        {
//			var ok = false;
//            if(!this.isUserInputExplicit()){
//                var addedVal = parseInt(userInput + character, 10);
//                ok = !isNaN(addedVal);
//            }
			
//				ok = !isNaN(character);
//				return ok;
//           // return parseInt(character, 10) <= definition.Max && parseInt(character, 10) >= definition.Min;
//        };
//        this.delUserInput = function ()
//        {
//            if(userInput.length > 0)
//            {
//                userInput = userInput.slice(0,userInput.length - 1);
//            }
//        };
//        this.addUserInput = function (character)
//        {
//            var addedVal = parseInt(character, 10);
//            if (!isNaN(addedVal))
//            {
//                if (userInput.length == this.length || parseInt(userInput + addedVal) > definition.max)
//                {
//                    userInput = "";
//                }

//                userInput = userInput + addedVal;
//            }
//        };	
//		this.isUserInputExplicit = function()
//        {
//            return parseInt(userInput + "0") > definition.max || userInput.length == this.length;
//        };
//			//Increment and decrement included for now
//		this.increment = function ()
//        {
//            var oldVal = this.getValue();

//            var num = parseInt("00000" + userInput);

//            num++;
//            if(num > definition.max)
//                num = definition.min;

//            userInput = num + "";

//            callbacks.onIncrement.call(this, oldVal);
//        };
//        this.decrement = function ()
//        {
//            var oldVal = this.getValue();

//            var num = parseInt("00000" + userInput);
//            num--;
//            if (num < definition.min)
//            {
//                num = definition.max;
//            }

//            userInput = num + "";

//            callbacks.onDecrement.call(this, oldVal);

//        }
//    }
	
//	 function AlphanumericInputType(definition, callbacks) //Strings -- needs major overhaul
//    {
//        this.length = definition.maxLength;
//        this.skip = false;
		
//		var selectedValue = 0;
       
        
//		this.setUserInput = function (val)
//		{
//		    userInput = val
//		};

//        this.accepts = function (character)
//        {
//            //temporary
//            return true;
//        };
//        this.getUserInput = function ()
//        {
//            //temporary
//            return userInput;
//        };
//        this.getReg = function ()
//        {
//            var res = [];
//            for (var i = 0; i < definition.length; i++)
//            {
//                res.push(definition[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
//            }
//            return res.join('|');
//        };
//        this.getValue = function ()
//        {
//            //temporary
//            return userInput;
//        };
//        this.addUserInput = function (char)
//        {
//            //temporary
//           userInput = userInput + char
//        };
//        this.isUserInputExplicit = function()
//        {
//            //temporary
//            return true;
//        };
//        this.delUserInput = function ()
//        {
//            if(userInput.length > 0)
//            {
//                userInput = userInput.slice(0,userInput.length - 1);
//            }
//        };
//        this.increment = function ()
//        {
//           //temporary
//        };
//        this.decrement = function ()
//        {
//           //temporary
//        }
//	 }

//	 function ValidatedInputType(definition, callbacks) 
//	 {
//	     this.length = definition.maxLength;
//	     this.skip = false;
		
//	     var selectedValue = 0;
       
        
//	     this.setUserInput = function (val)
//	     {
//	         userInput = val
//	     };

//	     this.accepts = function (character)
//	     {
//	         //temporary
//	         return true;
//	     };
//	     this.getUserInput = function ()
//	     {
//	         //temporary
//	         return userInput;
//	     };
//	     this.getReg = function ()
//	     {
//	         var res = [];
//	         for (var i = 0; i < definition.length; i++)
//	         {
//	             res.push(definition[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
//	         }
//	         return res.join('|');
//	     };
//	     this.getValue = function ()
//	     {
//	         //temporary
//	         return userInput;
//	     };
//	     this.addUserInput = function (char)
//	     {
//	         //temporary
//	         userInput = userInput + char
//	     };
//	     this.isUserInputExplicit = function()
//	     {
//	         //temporary
//	         return true;
//	     };
//	     this.delUserInput = function ()
//	     {
//	         if(userInput.length > 0)
//	         {
//	             userInput = userInput.slice(0,userInput.length - 1);
//	         }
//	     };
//	     this.increment = function ()
//	     {
//	         //temporary
//	     };
//	     this.decrement = function ()
//	     {
//	         //temporary
//	     }
//	 }
//		//the input segment itself
//function InputSegment(definition, index, startingPosition, callbacks)
//    {
//        this.index = index;
//        this.position = startingPosition;
		
		
//        if 		(definition.Type == "HardSeparatorType" || definition.Type == "-")
//        {
//            HardSeparatorType.call(this, definition, callbacks);
//        }
//        else if (definition.Type == "NumericInputType" || definition.Type == "N")
//        {
//            NumericInputType.call(this, definition, callbacks);
//        }
//        else if (definition.Type == "AlphanumericInputType" || definition.Type == "A")
//        {
//            AlphanumericInputType.call(this, definition, callbacks);
//        }
//		else if (definition.Type == "ValidatedInputType" || definition.Type == "V")
//		{
//			ValidatedInputType.call(this, definition, callbacks);
//		}
//    }
	
//	//Venture downwards with care!
//	var methods = {
//        init: function (options)
//        {
//            return $(this).filter('input').each(function ()
//            {
//                var $this = $(this);
//                var settings;
//                var segments = [];
//                var selectedSegment = 0;
//        //        $this.addClass('segment-picker');
               
//                    settings = $.extend({
//                        segments: [],
//             //           onIncrement: function(){},
//             //           onDecrement: function(){},
//                        onBlur: function(){},
//                        showSpinner: false
//                    }, options);
                

//                $this.data('segmentInput', {
//                    target: $this,
//                    settings: settings
//                });

//                function selectSegment(idx)
//                {
//                    var seg = segments[idx];
//                    if (seg)
//                    {
//                        $this[0].setSelectionRange(seg.position, seg.position + seg.length);
//                    }
//                }

//                function getReg()
//                {
//                    var value = "";
//                    for (var i = 0; i < segments.length; i++)
//                    {
//                        value += "(" + segments[i].getReg() + ")";
//                    }
//                    return value;
//                }

//                function findNextSegment(from)
//                {
//                    for(var i = from + 1; i < segments.length; i++)
//                    {
//                        if(!segments[i].skipable)
//                            return i;
//                    }

//                    return -1;
//                }

//                function findPrevSegment(from)
//                {
//                    for(var i = from - 1; i > -1; i--)
//                    {
//                        if(!segments[i].skipable)
//                            return i;
//                    }

//                    return -1;
//                }

//                function parseSegments(value)
//                {
//                    var reg = new RegExp('' + getReg() + '', 'i');
//                    if (reg.test(value))
//                    {
//                        var match = reg.exec(value);
//                        var result = [];
//                        for (var i = 0; i < segments.length; i++)
//                        {
//                            result.push(match[i + 1]);
//                        }
//                        return result;
//                    }

//                    return undefined;
//                }

//                function render()
//                {
//                    var value = "";
//                    for (var i = 0; i < segments.length; i++)
//                    {
//                        value += segments[i].getValue();
//                    }
//                    return value;
//                }

//                var pos = 0;
//                for (var i = 0; i < settings.segments.length; i++)
//                {
//                    var seg = new PickerSegment(settings.segments[i], i, pos, {
//                        onIncrement:function(oldVal)
//                        {
//                            settings.onIncrement.call($this[0], this.getValue(), oldVal, segments, this.index);
//                        },
//                        onDecrement:function(oldVal)
//                        {
//                            settings.onDecrement.call($this[0], this.getValue(), oldVal, segments, this.index);
//                        }
//                    });
//                    pos = pos + seg.length;
//                    segments.push(seg);
//                }

//                var init = parseSegments($this.val());

//                if (init)
//                {
//                    for (var i = 0; i < segments.length; i++)
//                    {
//                        segments[i].setUserInput(init[i]);
//                    }
//                    $this.val(render(segments));
//                }

//                $this.on('blur.segmentInput', function (e){
//                    selectedSegment = 0;
//                    settings.onBlur.call($this, segments);
//                });
//                $this.on('keypress.segmentInput', function (e)
//                {
//                    var character = e.ehcich || e.charCode;
//                    var strChar = String.fromCharCode(character);
//                    if (segments[selectedSegment].accepts(strChar))
//                    {
//                        segments[selectedSegment].addUserInput(strChar.toLowerCase());
//                        $this.val(render(segments));
//                        if(segments[selectedSegment].isUserInputExplicit())
//                        {
//                            var next = findNextSegment(selectedSegment);
//                            if(next != -1)
//                                selectedSegment = next;
//                        }
//                        selectSegment(selectedSegment);
//                    }
//                    e.preventDefault();
//                });

//                $this.on('focus.segmentInput', function (e)
//                {
//                    if (!$this.val())
//                    {
//                        var init = parseSegments($this.data('default'));
//                        if (init)
//                        {
//                            for (var i = 0; i < segments.length; i++)
//                            {
//                                segments[i].setUserInput(init[i]);
//                            }
//                            $this.val(render(segments));
//                        }
//                    }
//                    selectSegment(selectedSegment);

//                    if (settings.showSpinner) {

//                        var h = $this.height();
//                        h += parseInt($this.css('border-top-width'), 10);
//                        h += parseInt($this.css('padding-top'), 10);
//                        h += parseInt($this.css('border-bottom-width'), 10);
//                        h += parseInt($this.css('padding-bottom'), 10);

//                        buttons.find('div').height(h / 2).css({
//                            'line-height': (h / 2 - 1) + 'px',
//                            'font-size': ((h * 0.8) / 2) + 'px',
//                            'left': '-' + $this.css('margin-right')
//                        });
//                        buttons.find('div').first().css({
//                            'top': '-' + $this.css('border-top-width')
//                        });
//                        buttons.find('div').last().css({
//                            'bottom': '-' + $this.css('border-bottom-width')
//                        });
//                        buttons.css({
//                            'margin-top': $this.css('margin-top'),
//                            'margin-bottom': $this.css('margin-bottom'),
//                            'padding-top': $this.css('padding-top'),
//                            'padding-bottom': $this.css('padding-bottom'),
//                            'font-size': $this.css('font-size'),
//                            'vertical-align': $this.css('vertical-align'),
//                            'line-height': $this.css('line-height'),
//                            'border-top': $this.css('border-top'),
//                            'border-bottom': $this.css('border-bottom'),
//                            'border-top-color': 'transparent',
//                            'border-bottom-color': 'transparent',
//                            'height': $this.css('height')
//                        });
//                        $this.after(buttons);
//                    }
//                });
//                $this.on('mouseup.segmentInput', function(e){
//                    e.preventDefault();
//                    setTimeout(function(){
//                        selectSegment(selectedSegment);
//                    })
//                });
//                $this.on('mousedown.segmentInput', function (e)
//                {
//                    setTimeout(function(){
//                        var minDiff = 9999999;
//                        var pos = $this[0].selectionStart;
//                        var newSegment = selectedSegment;
//                        for (var i = 0; i < segments.length; i++)
//                        {
//                            var segment = segments[i];
//                            if(segment.skipable)
//                                continue;
//                            if(Math.abs(segment.position - pos) < minDiff)
//                            {
//                                minDiff = Math.abs(segment.position - pos);
//                                newSegment = i;
//                            }

//                            if(Math.abs(segment.position + segment.length - pos) < minDiff)
//                            {
//                                minDiff = Math.abs(segment.position + segment.length - pos);
//                                newSegment = i;
//                            }
//                        }
//                        selectedSegment = newSegment;
//                        selectSegment(selectedSegment);
//                    });

//                });

//                $this.on('keyup.segmentInput', function (e)
//                {
//                    $this.focus();
//                    e.preventDefault();
//                });

//                $this.on('update.segmentInput change.segmentInput', function(){
//                    var val = parseSegments($this.val());

//                    if (val)
//                    {
//                        for (var i = 0; i < segments.length; i++)
//                        {
//                            segments[i].setUserInput(val[i]);
//                        }
//                        $this.val(render(segments));
//                    }
//                });

//                $this.on('keydown.segmentInput', function (e)
//                {
//                    var keyCode = e.which || e.charCode;
//                    if(keyCode == 9)
//                    {
//                        if(e.shiftKey)
//                        {
//                            var prev = findPrevSegment(selectedSegment);
//                            if(prev != -1)
//                            {
//                                selectedSegment = prev;
//                                e.preventDefault();
//                            }

//                        }
//                        else
//                        {
//                            var next = findNextSegment(selectedSegment);
//                            if(next != -1)
//                            {
//                                selectedSegment = next;
//                                e.preventDefault();
//                            }
//                        }
//                    }
//                    if(keyCode == 8 || keyCode == 46){
//                        segments[selectedSegment].delUserInput();
//                        e.stopPropagation();
//                        e.preventDefault();
//                        $this.val(render(segments));
//                        selectSegment(selectedSegment);
//                    }
//                    if (keyCode >= 37 && keyCode <= 40)
//                    {
//                        e.stopPropagation();
//                        e.preventDefault();

//                        if (keyCode == 37)
//                        {
//                            var prev = findPrevSegment(selectedSegment);
//                            if(prev != -1)
//                                selectedSegment = prev;

//                        }
//                        else if (keyCode == 39)
//                        {

//                            var next = findNextSegment(selectedSegment);
//                            if(next != -1)
//                                selectedSegment = next;
//                        }
//                        else if (keyCode == 38)
//                        {
//                            segments[selectedSegment].increment();
//                            $this.val(render(segments));
//                        }
//                        else if (keyCode == 40)
//                        {
//                            segments[selectedSegment].decrement();
//                            $this.val(render(segments));
//                        }
//                        selectSegment(selectedSegment);
//                        return;
//                    }
//                });

//                $this.on('cut.segmentInput copy.segmentInput paste.segmentInput', function (e)
//                {
//                    e.preventDefault();
//                });

//                $this.on('blur.segmentInput', function(){
//                    setTimeout(function ()
//                    {
//                        buttons.detach();
//                    })
//                });

//                buttons.find('[data-up]').on('mousedown mouseup', function (e)
//                {
//                    e.preventDefault();
//                }).on('mousedown', function ()
//                {
//                    segments[selectedSegment].increment();
//                    $this.val(render(segments));
//                    $this.trigger('change');
//                    selectSegment(selectedSegment);
//                });
//                buttons.find('[data-down]').on('mousedown mouseup', function (e)
//                {
//                    e.preventDefault();
//                }).on('mousedown', function ()
//                {
//                    segments[selectedSegment].decrement();
//                    $this.val(render(segments));
//                    $this.trigger('change');
//                    selectSegment(selectedSegment);
//                });
//            });
//        },
//        isConnected: function ()
//        {
//            var $this = $(this);
//            var data = $this.data('segmentInput');
//            return data !== undefined;
//        }
//    };
	
//	   $.fn.segmentInput = function (method)
//    {
//        if (methods[method])
//        {
//            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
//        }
//        else if (typeof method === 'object' || !method)
//        {
//            return methods.init.apply(this, arguments);
//        }
//        else
//        {
//            $.error('Method ' + method + ' does not exist on jQuery.segmentInput');
//        }
//	   };
//})(jQuery));