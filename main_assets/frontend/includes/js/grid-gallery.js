/*
if (document.domain.indexOf('sitemind') > 0)
{
	var PATH = '/symphony/frontend/';
}
else
{

	var PATH = '/frontend/';
}
*/
var PATH = 'http://symphonyhotelmarketing.com/frontend/';


function nova_utility() {
    var $this = this;
           $this.isIE_func = function () {
        var isIE = false;
        var div = document.createElement('div');
        div.innerHTML = '<!--[if IE]><i></i><![endif]-->';
        if (div.getElementsByTagName('i').length == 1) isIE = true;
        return isIE;
    }
      $this.isImageLoaded = function (elem) {
        var imgwidth = 1;
        try {
            imgwidth = parseFloat($(elem).width())
        } catch (e) {}
        if (elem.complete && imgwidth > 1) {
            return true;
        } else {
            return false;
        }
    }
     $this.getStretchedDim = function (imageDimension, canvasDimension, tolerance, forceSimilarRatio) {
        var imgRatio = imageDimension.newWidth / imageDimension.newHeight;
        var boundaryRatio = canvasDimension.width / canvasDimension.height;
        var imgRatio_floored = Math.floor(imgRatio);
        var boundaryRatio_floored = Math.floor(boundaryRatio);
        var goForHeight = canvasDimension.height;
        var goForWidth = canvasDimension.width;
        if (imgRatio >= 1 && boundaryRatio < 1 && forceSimilarRatio == true) {
            return imageDimension;
        }
        if (imgRatio <= 1 && boundaryRatio > 1 && forceSimilarRatio == true) {
            return imageDimension;
        }
        var ratioDiff = Math.abs(1 - imgRatio / boundaryRatio);
        ratioDiff = Math.round(ratioDiff * 100);
        if (ratioDiff < tolerance) {
            if (imageDimension.newHeight < goForHeight) {
                var ratio = goForHeight / imageDimension.newHeight;
                imageDimension.newHeight *= ratio;
                imageDimension.newWidth *= ratio;
            }
            if (imageDimension.newWidth < goForWidth) {
                var ratio = goForWidth / imageDimension.newWidth;
                imageDimension.newHeight *= ratio;
                imageDimension.newWidth *= ratio;
            }
        }
        imageDimension.newWidth = Math.ceil(imageDimension.newWidth);
        imageDimension.newHeight = Math.ceil(imageDimension.newHeight);
        return imageDimension;
    }
    $this.calcImageSize = function ($width, $height, maxW, maxH, maxzoom) {
        maxzoom = maxzoom || 10;
        maxzoom_width = $width * maxzoom;
        maxzoom_height = $height * maxzoom;
        maxW = (maxW > maxzoom_width) ? maxzoom_width : maxW;
        maxH = (maxH > maxzoom_height) ? maxzoom_height : maxH;
        $this.maxHeight = maxH;
        $this.maxWidth = maxW;
        var $newSize = $this.calcWidth($width, $height);
        if ($this.maxHeight > 0 && $newSize['newHeight'] > $this.maxHeight) {
            $newSize = $this.calcHeight($newSize['newWidth'], $newSize['newHeight']);
        }
        $newSize = $this.calcHeight($width, $height);
        if ($this.maxWidth > 0 && $newSize['newWidth'] > $this.maxWidth) {
            $newSize = $this.calcWidth($newSize['newWidth'], $newSize['newHeight']);
        }
        return $newSize;
    }
    $this.calcWidth = function ($width, $height) {
        var $newWp = (100 * $this.maxWidth) / $width;
        $newHeight = ($height * $newWp) / 100;
        return {
            'newWidth': Math.round($this.maxWidth),
            'newHeight': Math.round($newHeight)
        };
    }
    $this.calcHeight = function ($width, $height) {
        var $newHp = (100 * $this.maxHeight) / $height;
        var $newWidth = ($width * $newHp) / 100;
        return {
            'newWidth': Math.round($newWidth),
            'newHeight': Math.round($this.maxHeight)
        };
    }

}
var nova_utils = new nova_utility();


function imageGrid(container, options) {
    var $this = this;
    $this.container = container;
    $this.container.css('position', 'relative');
    $this.ghosts = [];
    var defaultOptions = {
        alternateHeight: [200, 150],
        imagegap: 30,
        maxW: 400,
        ghosting: true,
        forcewidth: 0,
        samewidthtarget: 0
    };
    $this.isIE = nova_utils.isIE;
    $this.options = defaultOptions;
    for (opt in options) {
        $this.options[opt] = options[opt];
    }
    $this.options.minwidth_hope = Math.round($this.options.maxW / 2);
    $this.arrObject = [];
    $this.setContainerFixedWidth = function () {
        var w = $this.container.parent().width();
        $this.container.css('width', w + 'px');
        return w;
    }
    $this.draw = function () {
        var targetW = $this.setContainerFixedWidth();
        var item;
        while (item = $this.ghosts.shift()) {
            item.a.remove();
        }
        var arrResult = [];
        var arr = $this.arrObject.slice(0);
        var currentLine = 0;
        var currentTop = 0;
        while (arr.length > 0) {
            var currentHeight = $this.options.alternateHeight[currentLine];
            var tmp = $this.getLine(arr, currentHeight, targetW, currentTop);
            currentTop += currentHeight + $this.options.imagegap;
            arr = tmp[0];
            var item;
            while (item = tmp[1].shift())
                arrResult.push(item);
            currentLine++;
            if (currentLine > $this.options.alternateHeight.length - 1) currentLine = 0;
        }
        $this.draw_step2(arrResult);
    }
    $this.draw_step2 = function (arrResult) {
        var maximumheight = 0;
        for (var i = 0; i < arrResult.length; i++) {
            var obj = arrResult[i];
            if ($this.options.forcewidth != 0) {
                obj.forceWidth = $this.options.forcewidth;
            }
            var css4a = {
                width: obj.forceWidth + 'px',
                height: obj.forceHeight + 'px',
                overflow: 'hidden',
                display: 'block',
                position: 'absolute',
                left: obj.leftPos + 'px',
                top: obj.topPos + 'px'
            };
            obj.a.css(css4a);
            var imageWidth = obj.thumbWidth;
            var imageHeight = obj.thumbHeight;
            if (imageWidth < obj.forceWidth) {
                var ratio = obj.forceWidth / imageWidth;
                imageWidth = imageWidth * ratio;
                imageHeight = imageHeight * ratio;
            }
            if (imageHeight < obj.forceHeight) {
                var ratio = obj.forceHeight / imageHeight;
                imageWidth = imageWidth * ratio;
                imageHeight = imageHeight * ratio;
            }
            maximumheight = Math.max(maximumheight, obj.topPos + obj.forceHeight + $this.options.imagegap);
            var imageLeft = -Math.round((imageWidth - obj.forceWidth) / 2);
            var imageTop = -Math.round((imageHeight - obj.forceHeight) / 2);
            imageWidth = Math.ceil(imageWidth);
            imageHeight = Math.ceil(imageHeight);
            var css4img = {
                width: imageWidth + 'px',
                height: imageHeight + 'px',
                top: imageTop,
                left: imageLeft
            };
            obj.img.css(css4img);
        }
        $this.container.css({
            height: (maximumheight - $this.options.imagegap) + 'px'
        });
    }
    $this.getTotalWidth = function (itemcount, itemwidth, margin) {
        var v1 = itemcount * itemwidth;
        var v2 = (itemcount - 1) * margin;
        return v1 + v2;
    }
    $this.getLine = function (arrObject, currentHeight, targetW, currentTop) {
        var returnArr = [];
        var widthReached = 0;
        var ghost_index = 0;
        var shifted = [];
        var obj;
        var decal = 0;
        var first = true;
        if ($this.options.samewidthtarget != 0) {
            var ssw = $this.options.samewidthtarget;
            ssw = Math.min(ssw, $this.setContainerFixedWidth());
            if (ssw < 1) ssw = 1;
            var countPerLine = targetW / ($this.options.samewidthtarget + $this.options.imagegap / 2);
            countPerLine = (countPerLine <= 0) ? 1 : countPerLine;
            countPerLine = Math.round(countPerLine);
            var perfectWidth = 1;
            var tries = 0;
            while (true) {
                var achievedWidth = $this.getTotalWidth(countPerLine, perfectWidth, $this.options.imagegap);
                if (achievedWidth == targetW) {
                    break;
                }
                if (achievedWidth > targetW) {
                    perfectWidth--;
                    break;
                }
                perfectWidth++;
                if (tries++ > 500) {
                    perfectWidth = $this.setContainerFixedWidth();
                    break;
                }
            }
            $this.options.forcewidth = perfectWidth;
        }
        if ($this.options.forcewidth != 0) $this.options.minwidth_hope = $this.options.forcewidth;
        var maxOnThisLine = Math.floor(targetW / ($this.options.minwidth_hope + $this.options.imagegap / 2));
        maxOnThisLine = (maxOnThisLine <= 0) ? 1 : maxOnThisLine;
        var countOnLine = 0;
        while (obj = arrObject.shift()) {
            var thumb1 = $this.thumbSize(obj.imgW, obj.imgH, $this.options.maxW, currentHeight);
            obj.thumbWidth = thumb1.newWidth;
            obj.thumbHeight = thumb1.newHeight;
            obj.forceWidth = thumb1.newWidth;
            obj.forceHeight = currentHeight;
            obj.topPos = currentTop;
            obj.leftPos = decal;
            shifted.push(obj);
            if (first)
                gap = 0;
            else
                gap = $this.options.imagegap;
            first = false;
            widthReached += thumb1.newWidth + gap;
            decal += thumb1.newWidth + $this.options.imagegap;
            if (++countOnLine >= maxOnThisLine) {
                break;
            }
            if (widthReached < targetW && arrObject.length == 0) {
                if ($this.options.ghosting != true) {
                    return [arrObject, shifted];
                }
                var ghost = $this.makeGhost($this.arrObject[ghost_index]);
                $this.ghosts.push(ghost);
                arrObject.push(ghost);
                ghost_index++;
                if (ghost_index > $this.arrObject.length - 1) ghost_index = 0;
            }
            if (widthReached >= targetW) {
                break;
            }
        }
        var reflowdone = false;
        if (widthReached <= targetW) {
            var underFlow = targetW - widthReached;
            var reflow_per_item = Math.ceil(underFlow / shifted.length);
            for (var i = 0; i < shifted.length; i++) {
                shifted[i].forceWidth += reflow_per_item;
                if (shifted[i + 1]) {
                    shifted[i + 1].leftPos += reflow_per_item;
                }
                underFlow -= reflow_per_item;
                if (underFlow <= 0) {
                    shifted[i].forceWidth -= Math.abs(underFlow);
                    if (shifted[i + 1]) {
                        shifted[i + 1].leftPos -= Math.abs(underFlow);
                    }
                    break;
                }
            }
            reflowdone = true;
        } else {
            var overflow = widthReached - targetW;
            var overflow_per_item = Math.ceil(overflow / shifted.length);
            for (var i = 0; i < shifted.length; i++) {
                shifted[i].forceWidth -= overflow_per_item;
                if (shifted[i + 1]) {
                    shifted[i + 1].leftPos -= overflow_per_item;
                }
                overflow -= overflow_per_item;
                if (overflow <= 0) {
                    shifted[i].forceWidth += Math.abs(overflow);
                    if (shifted[i + 1]) {
                        shifted[i + 1].leftPos += Math.abs(overflow);
                    }
                    break;
                }
            }
        }
        var decal = 0;
        for (var i = 0; i < shifted.length; i++) {
            shifted[i].leftPos = decal;
            decal += shifted[i].forceWidth + ($this.options.imagegap);
        }
        return [arrObject, shifted];
    }
    $this.makeGhost = function (obj) {
        var newobj = {};
        newobj.a = obj.a.clone(true, true);
        newobj.a.addClass('montageghost');
        newobj.a.removeAttr('novagalfirst');
        newobj.a.removeAttr('novagal');
        newobj.a.removeAttr('novagalchild');
        newobj.img = newobj.a.find('img');
        newobj.img.addClass('montageghost');
        newobj.imgW = obj.imgW;
        newobj.imgH = obj.imgH;
        newobj.a.appendTo($this.container);
        return newobj;
    }
    $this.__construct = function () {
        var ii = 0;
        $this.container.find('a').each(function () {
            var entry = {};
            entry.a = $(this);
            entry.img = entry.a.find('img');
            entry.imgW = entry.img.attr('width');
            entry.imgH = entry.img.attr('height');
            entry.a.css({
                overflow: 'hidden',
                display: 'block',
                position: 'absolute'
            });
            entry.img.css({
                position: 'absolute'
            });
            $this.arrObject.push(entry);
        });
        $this.draw();
        $this.timeoutresize = 0;
        $(window).resize(function () {
            clearTimeout($this.timeoutresize);
            $this.timeoutresize = setTimeout($this.draw, 100);
        });
    }
    $this.thumbSize = function ($width, $height, maxW, maxH) {
        if ($this.options.forcewidth != 0) {
            return nova_utils.calcImageSize($width, $height, $this.options.forcewidth, 600000);
        }
        return nova_utils.calcImageSize($width, $height, maxW, maxH);
    }
    $this.__construct();
}

/*NOVA BOX POPUP*/

function buildGallery(obj) {
    var $this = this;
    var defaultOptions = {
        'targetcanvas': $([]),
        'modeieperf': true,
        'anchorselector': '',
        'closeable': true,
        'openfirst': false,
        'positioning': 'fixed',
        'downsizedimage': false,
        'downsizedimage_fullfill': true,
        'fillcontainer': true,
        'maxzoom': 1.5,
        'stretchRatioTolerance': 50,
        'overlayopacity': '1',
        'respectHorizontalBoundaries': true,
        'respectVerticalBoundaries': false,
        'required_min_width_or_height_for_zoom': 0,
        imagemargin: [0, 0, 0, 0],
        canvasmargin: [0, 0, 0, 0],
        innoverlayinheritmargins: false,
        'leftrightclickable': 'contain',
        'mousecursorleft': PATH+'/includes/js/arrowPrev.png',
        'mousecursorright': PATH+'/includes/js/arrowNext.png',
        'captionrelativeto': 'fullviewport',
        'captionreveal': function (c) {
            c.delay(0).css({
                'left': '30px',
                'opacity': '0'
            }).animate({
                'opacity': 1,
                'left': '15px'
            }, 500);
        },
        'socialmedia_code': '',
        'useStopCommand': true
    }
    var options = defaultOptions
    for (var opt in obj) {
        options[opt] = obj[opt];
    }
    if (options.targetcanvas.length == 0) options.targetcanvas = $('body');
    if (options.socialmedia_code != '') {
        options.useStopCommand = false;
    }
    $this.anchorlist = $(options.anchorselector);
    if ($this.anchorlist.length == 0) return;
    $this.options = options;
    $this.options.anchorlist = $this.anchorlist;
    $this.overlay = null;
    $this.loadPictureTimer = 0;
    $this.imgblank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    $this.photocount = 0;
    $this.img2social = {};
    $this.canvasmarginobj = {
        'top': $this.options['canvasmargin'][0],
        'right': $this.options['canvasmargin'][1],
        'bottom': $this.options['canvasmargin'][2],
        'left': $this.options['canvasmargin'][3]
    }
    $this.__construct = function () {
        $this.initSocialMedia();
        $this.options.imgtohidelist = $this.anchorlist.find('img');
        var newImgStack = [];
        var newAStack = [];
        $this.options.imgtohidelist.each(function () {
            if ($(this).hasClass('montageghost')) return;
            newImgStack.push(this);
        });
        $this.options.anchorlist.each(function () {
            if ($(this).hasClass('montageghost')) return;
            newAStack.push(this);
        });
        $this.options.imgtohidelist = jQuery([]).pushStack(newImgStack);
        $this.options.anchorlist = jQuery([]).pushStack(newAStack);
        $this.isitie = $this.isIE();
        var index = 0;
        $this.options.anchorlist.each(function () {
            $(this).data('index', index++);
        });
        $this.photocount = $this.options.anchorlist.length;
        if ($this.photocount == 0) return;
        $this.addOverlay();
        $this.addListener();
        $this.addHtml();
        $this.setupcontrols();
        $this.nextClickDontStop = false;
        $this.setupDownSize();
        if ($this.options.openfirst) {
            setTimeout(function () {
                $this.nextClickDontStop = true;
                $this.anchorlist.eq(0).click();
            }, 10)
        }
    }
    $this.initSocialMedia = function () {
        if ($this.options.socialmedia_code != '') {
            var secretElem = 'gallery_social_' + Math.round(Math.random() * 10000);
            secretElem = $('<div style="display:none" id="' + secretElem + '"></div>');
            $('body').append(secretElem);
            $this.options.anchorlist.each(function () {
                var href = $(this).attr('href');
                if ((/\/(\d+)\.jpg$/).test(href)) {
                    var idimg = RegExp.$1;
                    var code = $this.options.socialmedia_code;
                    var elem = $(code);
                    $this.img2social[idimg] = elem;
                    elem.name = 'idimg:' + idimg;
                    elem.attr('addthis:url', $('#current_page_url').val() + '?nvgfb=' + idimg)
                    elem.appendTo(secretElem);
                }
            });
            $('body').append('<scr' + 'ipt type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-5012a4af5408c5c8"></sc' + 'ript>');
        }
    };
    $this.setupDownSize = function () {
        if (!$this.options.downsizedimage) return;
        var maxW = Math.round($this.options.targetcanvas.width());
        var maxH = Math.round($this.options.targetcanvas.height());
        $this.anchorlist.each(function () {
            var href = $(this).attr('href');
            if ((/galleria\/(\d+)\.jpg/).test(href)) {
                var newhref;
                if ($this.options.downsizedimage_fullfill) {
                    newhref = nova_utils.getGalleriaThumbMinHref(RegExp.$1, maxW, maxH);
                } else {
                    newhref = nova_utils.getGalleriaThumbHref(RegExp.$1, maxW, maxH);
                }
                var suffix = '';
                if ((/(http:\/\/.+?\.cloudfront\.net)\//).test(href))
                    suffix = RegExp.$1
                $(this).attr('href', suffix + newhref);
            }
        })
    }
    $this.syncLoadImage = function (arrimg) {
        for (var i = 0; i < arrimg.length; i++) {
            var url = arrimg[i];
            var img = new Image();
            img.src = url;
        }
    }
    $this.setupcontrols = function () {
        if ($this.options.leftrightclickable == 'item') {
            $this.wrapper.find('.gallery_item_next').click(function () {
                $this.navig(1)
            }).css('cursor', 'pointer');
            $this.wrapper.find('.gallery_item_prev').click(function () {
                $this.navig(-1)
            }).css('cursor', 'pointer');
        }
        if ($this.options.leftrightclickable == 'contain') {
            var suffixauto = '';
            if ($this.isitie) {
                $this.options.mousecursorleft = $this.options.mousecursorleft.replace('.png', '.cur');
                $this.options.mousecursorright = $this.options.mousecursorright.replace('.png', '.cur');
            } else {
                suffixauto = ',auto';
            }
            $this.wrapper.find('.gallery_contain_next').click(function () {
                $this.navig(1)
            }).css('cursor', "url(" + $this.options.mousecursorright + ")" + suffixauto);
            $this.wrapper.find('.gallery_contain_prev').click(function () {
                $this.navig(-1)
            }).css('cursor', "url(" + $this.options.mousecursorleft + ")" + suffixauto);
            $this.wrapper.find('.gallery_item_next').hide();
            $this.wrapper.find('.gallery_item_prev').hide();
        }
    }
    $this.navig = function (sens) {
        if ($this.loadingPicture) return;
        $this.loadingPicture = true;
        var next = $this.navig_internal($this.showingindex, sens);
        $this.loadPicture(next);
    }
    $this.navig_internal = function (current, sens) {
        if (sens == 1) {
            var next = current - 1 + 2;
            if (next > $this.photocount - 1) next = 0;
        } else {
            var next = current - 1
            if (next <= -1) next = $this.photocount - 1;
        }
        return next;
    }
    $this.setupclosehandler = function () {
        if (!$this.options['closeable']) return;
        $this.closebutton.click($this.closeBox);
        $(document).bind('keydown', $this.closeonechap);
    }
    $this.setupkeyboardnavig = function () {
        $(document).bind('keydown', $this.keynavigation);
    }
    $this.keynavigation = function (event) {
        if (event.which == 37) {
            event.preventDefault();
            $this.navig(-1);
        }
        if (event.which == 39) {
            event.preventDefault();
            $this.navig(1);
        }
    }
    $this.closeonechap = function (event) {
        if (event.which == 27) {
            $this.closeBox();
        }
    }
    $this.closeBox = function () {
        $this.showmontage();
        clearInterval($this.loadPictureTimer);
        $(document).unbind('keydown', $this.closeonechap);
        $(document).unbind('keydown', $this.keynavigation);
        $(window).unbind('resize', $this.resizefunc);

         $this.setselectable();

          $this.overlay.stop().delay(300).animate({opacity: 0}, 300, 'swing');
          $this.overlay2.stop().delay(300).animate({opacity: 0}, 300, 'swing');

         $this.wrapper.fadeOut(300,'swing', function(){
	     $this.overlay2.css('display', 'none');
         $this.wrapper.css('display', 'none');
         $this.overlay.css('display', 'none');
         $this.imgwrap.find('img').remove();

         })


    }
    $this.addOverlay = function () {
        $this.overlay = $('<div class=galleryoverlay />');
        if ($this.options['positioning'] == 'fixed') {
            $this.overlay.css('position', 'fixed');
            $this.overlay.appendTo($('body'));
        } else {
            $this.overlay.css('position', 'absolute');
            $this.overlay.appendTo($this.options['targetcanvas']);
        }
        if (($this.options['targetcanvas'][0].tagName + '').toUpperCase() != 'BODY') {
            $this.options['targetcanvas'].css('position', 'relative');
        }
        $this.overlay2 = $('<div class=galleryoverlay style="width:100%;height:100%" />');
        if ($this.options.inneroverlayinheritmargins) {
            $this.overlay2.css({
                'display': 'none',
                'margin-top': $this.canvasmarginobj.top,
                'margin-right': $this.canvasmarginobj.right,
                'margin-bottom': $this.canvasmarginobj.bottom,
                'margin-left': $this.canvasmarginobj.left
            });
        } else {
            $this.overlay2.css({
                'display': 'none'
            });
        }
        $this.overlay2.prependTo($this.options['targetcanvas']);
    }
    $this.addHtml = function () {
        var template = ' <div class="gallery_wrapper"> ' + ' <div class="gallery_imagepreloader"></div> ' + ' <div class="gallery_image"> ' + '  <div class="gallery_caption"><div class="gallery_captiontext"></div></div> ' + '  <div class="gallery_social"><div class="gallery_socialcontent"></div></div> ' + '  <!--image goes here-->  ' + '  ' + ' </div> ' + ' <div class="gallery_image_captionposition"> ' + ' <div class="gallery_image_imageonly"></div> ' + ' <div class="gallery_image_viewportwidth"></div> ' + ' <div class="gallery_image_viewportheight"></div> ' + ' <div class="gallery_image_fullviewport"></div> ' + '  </div> ' + ' <div class=gallery_contain_next><div class=gallery_wrapper_next><div class=gallery_wrapper2_next><div class="gallery_item_next"></div></div></div></div>' + ' <div class=gallery_contain_prev><div class=gallery_wrapper_prev><div class=gallery_wrapper2_prev><div class="gallery_item_prev"></div></div></div></div> ' + ' <div class="gallery_close"></div> ' + '</div>';
        $this.wrapper = $(template);
        if ($this.options['positioning'] == 'fixed') {
            $this.wrapper.css('position', 'fixed');
            $this.wrapper.appendTo('body');
        } else {
            $this.wrapper.css('position', 'absolute');
            $this.wrapper.appendTo($this.options.targetcanvas);
        }
        $this.imgwrap = $this.wrapper.find('.gallery_image');
        $this.preloader = $this.wrapper.find('.gallery_imagepreloader');
        $this.closebutton = $this.wrapper.find('.gallery_close');
        if (!$this.options['closeable']) {
            $this.closebutton.hide();
        }
        $this.caption = $this.wrapper.find('.gallery_caption');
        $this.captiontxt = $this.wrapper.find('.gallery_captiontext');
        $this.caption.appendTo($this.wrapper.find('.gallery_image_' + $this.options.captionrelativeto));
        $this.social = $this.wrapper.find('.gallery_social');
        $this.socialcontent = $this.wrapper.find('.gallery_socialcontent');
        $this.social.appendTo($this.wrapper.find('.gallery_image_' + $this.options.captionrelativeto));
        $this.captionpos_imageonly = $this.wrapper.find('.gallery_image_imageonly');
        $this.captionpos_viewportwidth = $this.wrapper.find('.gallery_image_viewportwidth');
        $this.captionpos_viewportheight = $this.wrapper.find('.gallery_image_viewportheight');
    }
    $this.addListener = function () {
        $(options.anchorselector).on('click', function (event) {
            event.preventDefault();
            $this.open($(this).data('index'));
        })
    }
    $this.tmp = 0;
    $this.resizefunc = function () {
        var f = function () {
            $this.sizeWrapper();
            $this.sizeOverlay();
            if (!$this.loadingPicture) {
                $this.loadPicture_final();
            }
        }
        clearTimeout($this.tmp);
        $this.tmp = setTimeout(f, 200);
    }
    $this.backhidden = false;
    $this.hidemontage = function () {
        if (!$this.isitie || $this.options.modeieperf == false) return;
        $this.options.imgtohidelist.each(function () {
            $(this).data('src', $(this).attr('src'));
            $(this).attr('src', $this.imgblank);
        });
        $this.backhidden = true;
    }
    $this.showmontage = function () {
        if (!$this.isitie || $this.options.modeieperf == false) return
        $this.options.imgtohidelist.each(function () {
            $(this).attr('src', $(this).data('src'));
        });
        $this.backhidden = false;
    }
    $this.setunselectable = function () {
        $('body').css({
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            '-o-user-select': 'none',
            'user-select': 'none'
        });
    }
    $this.setselectable = function () {
        $('body').css({
            '-webkit-user-select': 'text',
            '-khtml-user-select': 'text',
            '-moz-user-select': 'text',
            '-ms-user-select': 'text',
            '-o-user-select': 'text',
            'user-select': 'text'
        });
    }
    $this.open = function (index) {
        if ($this.backhidden == false) {
            $this.hidemontage();
        }
        $this.setunselectable();
        $this.setupclosehandler();
        $this.setupkeyboardnavig();
       $this.openOverlay();
        $this.sizeWrapper();
        $this.loadPicture(index);
        $(window).bind('resize', $this.resizefunc);

         $this.overlay2.stop().css({
                opacity: 0,
                'display': 'block'
            }).animate({
                opacity: 1
            }, 300, 'swing');

       /* $this.overlay2.css('display', 'block');*/
    }
    $this.prefetcher = function () {
        var next1 = $this.navig_internal($this.showingindex, 1);
        var next2 = $this.navig_internal(next1, 1);
        var next3 = $this.navig_internal(next2, 1);
        var next4 = $this.navig_internal(next3, 1);
        $this.arrPrefetch = [$this.options.anchorlist.eq(next1).attr('href'), $this.options.anchorlist.eq(next2).attr('href'), $this.options.anchorlist.eq(next3).attr('href'), $this.options.anchorlist.eq(next4).attr('href')];
        var f = function () {
            if ($this.arrPrefetch.length == 0) return;
            var src = $this.arrPrefetch.shift();
            var img = new Image();
            $(img).load(function () {
                f();
            })
            img.src = src;
        }
        f();
    }
    $this.loadPicture_final = function () {
        $this.img.stop();
        $this.img.css({
            'opacity': 0
        });
        var imgW = $this.img.outerWidth();
        var imgH = $this.img.outerHeight();
        if (String($this.img.data('realW')) == 'undefined') {
            $this.img.data('realW', imgW)
            $this.img.data('realH', imgH)
        }
        var imgW = $this.img.data('realW');
        var imgH = $this.img.data('realH');
        var obj = $this.getBoundaries();
        var margin = {};
        margin.top = $this.options.imagemargin[0];
        margin.right = $this.options.imagemargin[1];
        margin.bottom = $this.options.imagemargin[2];
        margin.left = $this.options.imagemargin[3];
        if (imgW >= $this.options.required_min_width_or_height_for_zoom || imgH >= $this.options.required_min_width_or_height_for_zoom) {
            var computed = $this.calcImageSize(imgW, imgH, obj.width - margin.right - margin.left, obj.height - margin.top - margin.bottom, $this.options.maxzoom);
            if ($this.options.fillcontainer) {
                computed = $this.getStretchedDim(computed, margin, imgW, imgH, obj, $this.options.maxzoom, imgW, imgH);
            }
        } else {
            var computed = {
                newWidth: imgW,
                newHeight: imgH
            }
        }
        var top = Math.floor((obj.height - margin.bottom - margin.top) / 2 - (computed.newHeight / 2)) + margin.top;
        var left = Math.floor((obj.width - margin.right - margin.left) / 2 - (computed.newWidth / 2)) + margin.left;
        $this.img.attr({
            'width': computed.newWidth,
            'height': computed.newHeight
        });
        $this.img.css({
            width: computed.newWidth,
            height: computed.newHeight,
            top: top,
            left: left
        });
        setTimeout(function () {
            $this.img.stop().css({
                opacity: 0,
                'visibility': 'visible'
            }).animate({
                opacity: 1
            }, 300, 'swing', $this.hideLoader);
        }, 1);
        $this.setupcaptiongeometry(top, left, computed.newWidth, computed.newHeight);
        $this.setupcaptioncontent();
        $this.setupsocialcontent();
        $this.prefetcher();
    }
    $this.loadPicture_check = function () {
        if (nova_utils.isImageLoaded($this.img[0])) {
            clearInterval($this.loadPictureTimer);
            $this.loadPicture_final();
        } else {
            $this.showLoader();
        }
    }
    $this.loadPicture = function (index) {
        $this.showingindex = index;
        clearInterval($this.loadPictureTimer);
        $this.caption.stop().css('opacity', 0);
        var href = $this.options.anchorlist.eq(index).attr('href');
        $this.imgwrap.find('img').remove();
        var newimg = $('<img>');
        $this.img = newimg;
        $this.img.css({
            'opacity': 0,
            'visibility': 'hidden'
        })
        $this.img.appendTo($this.imgwrap)
        if ($this.nextClickDontStop) {
            $this.nextClickDontStop = false;
        } else {
            if ($this.options.useStopCommand)
                nova_utils.windowStop();
        }
        $this.img.attr('src', href);
        $this.loadPicture_check_iteration = 0;
        $this.loadPictureTimer = setInterval($this.loadPicture_check, 20);
    }
    $this.getStretchedDim = function (computed, margin, imgW, imgH, obj, maxzoom) {
        var imgRatio = imgW / imgH;
        var boundaryRatio = obj.width / obj.height;
        var imgRatio_floored = Math.floor(imgRatio);
        var boundaryRatio_floored = Math.floor(boundaryRatio);
        var goForHeight = obj.height - margin.bottom - margin.top;
        var goForWidth = obj.width - margin.right - margin.left;
        if (imgRatio >= 1 && boundaryRatio < 1) {
            return computed;
        }
        if (imgRatio <= 1 && boundaryRatio > 1) {
            return computed;
        }
        if (goForWidth / imgW > maxzoom) {
            return computed;
        }
        if (goForHeight / imgH > maxzoom) {
            return computed;
        }
        var ratioDiff = Math.abs(1 - imgRatio / boundaryRatio);
        ratioDiff = Math.round(ratioDiff * 100);
        if (ratioDiff < $this.options.stretchRatioTolerance) {
            if (computed.newHeight < goForHeight) {
                var ratio = goForHeight / computed.newHeight;
                computed.newHeight *= ratio;
                computed.newWidth *= ratio;
            }
            if (computed.newWidth < goForWidth) {
                var ratio = goForWidth / computed.newWidth;
                computed.newHeight *= ratio;
                computed.newWidth *= ratio;
            }
        }
        return computed;
    }
    $this.setupsocialcontent = function () {
        if ($this.options.socialmedia_code == '') return;
        $this.socialcontent.html('')
        var href = $this.options.anchorlist.eq($this.showingindex).attr('href');
        if ((/\/(\d+)\.jpg$/).test(href)) {
            var idimg = RegExp.$1;
            if (idimg in $this.img2social) {
                $this.img2social[idimg].appendTo($this.socialcontent)
            }
        }
    };
    $this.setupcaptioncontent = function () {
        $this.caption.stop();
        var txt = $this.options.anchorlist.eq($this.showingindex).attr('title');
        if (!txt) {
            txt = $this.options.anchorlist.eq($this.showingindex).attr('titlebackup');
        }




        $this.captiontxt.html(txt);





         var html_org = $this.captiontxt.html();
         var html_calc = '<span>' + html_org + '</span>';
         $this.captiontxt.html(html_calc);
         var widthText = $this.captiontxt.find('span:first').width();
         var heightText = $this.captiontxt.find('span:first').height();

        $this.captiontxt.css({width:widthText+10, height:heightText});
        $this.options.captionreveal($this.caption);

        if( $this.captiontxt.find('span').html() ==''){
            $this.captiontxt.parent().css({display:'none'});
        }
    }
    $this.setupcaptiongeometry = function (imgtop, imgleft, imgwidth, imgheight) {
        $this.captionpos_imageonly.css({
            top: imgtop,
            left: imgleft,
            width: imgwidth,
            height: imgheight
        });
        $this.captionpos_viewportwidth.css({
            top: imgtop,
            height: imgheight
        });
        $this.captionpos_viewportheight.css({
            left: imgleft,
            width: imgwidth
        });
    }
    $this.sizeWrapper = function () {
        var obj = $this.getBoundaries();
        $this.wrapper.css({
            display: 'block',
            left: obj.left + 'px',
            top: obj.top + 'px',
            width: obj.width + 'px',
            height: obj.height + 'px'
        });
    }
    $this.sizeOverlay = function () {
        var obj = $this.getBoundaries();
        $this.overlay.css({
            top: (obj.top) + 'px',
            left: (obj.left) + 'px',
            width: (obj.width) + 'px',
            height: (obj.height) + 'px'
        });
    }
    $this.openOverlay = function () {


            $this.overlay.stop().css({
                opacity: 0,
                'display': 'block'
            }).animate({
                opacity: 1
            }, 300, 'swing');


                 /* $this.overlay.css({
            'display': 'block'
        });*/
        $this.sizeOverlay();
    }
    $this.getBoundaries = function () {
        var targetoffset = $this.options.targetcanvas.offset();
        var targettop = targetoffset.top;
        var scrollTop = $this.getScrollTop();
        if ($this.options.respectVerticalBoundaries)
            var top = Math.max(targettop, scrollTop);
        else
            var top = scrollTop;
        var targetleft = targetoffset.left;
        var scrollLeft = $('body').scrollLeft();
        if ($this.options.respectHorizontalBoundaries)
            var left = Math.max(targetleft, scrollLeft);
        else
            var left = scrollLeft;
        var viewportWidth = $(window).width();
        var viewportHeight = $(window).height();
        if (!$this.options.respectVerticalBoundaries) {
            var height = viewportHeight;
        } else {
            var height = $this.options.targetcanvas.height();
        }
        if (!$this.options.respectHorizontalBoundaries) {
            var width = viewportWidth;
        } else {
            var width = $this.options.targetcanvas.width();
        }
        if ($this.options.positioning != 'fixed') {
            left = 0;
            top = 0;
        }
        return {
            top: $this.canvasmarginobj.top,
            left: left + $this.canvasmarginobj.left,
            width: width - $this.canvasmarginobj.left - $this.canvasmarginobj.right,
            height: height - $this.canvasmarginobj.top - $this.canvasmarginobj.bottom
        }
    }
    $this.hideLoader = function () {
        $this.loadingPicture = false;
        $this.preloader.css('display', 'none');
    }
    $this.showLoader = function () {
        $this.preloader.css('display', 'block');
    }
    $this.calcImageSize = function ($width, $height, maxW, maxH, maxzoom) {
        return nova_utils.calcImageSize($width, $height, maxW, maxH, parseFloat(maxzoom));
    }
    $this.getScrollTop = function () {
        if (typeof pageYOffset != 'undefined') {
            return pageYOffset;
        } else {
            var B = document.body;
            var D = document.documentElement;
            D = (D.clientHeight) ? D : B;
            return D.scrollTop;
        }
    }
    $this.isIE = function () {
        var isIE = false;
        var div = document.createElement('div');
        div.innerHTML = '<!--[if IE]><i></i><![endif]-->';
        if (div.getElementsByTagName('i').length == 1) isIE = true;
        return isIE;
    }
    $this.__construct();
}



