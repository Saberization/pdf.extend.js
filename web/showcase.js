(function (win, fn) {
    'use strict';

    var returnVal = fn();

    for (var k in returnVal) {
        win[k] = returnVal[k];
    }

}(this, function () {
    var pdfJsApi = {
        /**
         * 获取上传路径
         * @param {String} path 上传路径
         * 必须开启 工具 -> Internet选项 -> 安全 -> 自定义级别 -> 找到“其他”中的“将本地文件上载至服务器时包含本地目录路径”
         * 
         * pageNumberNavitorTo 跳转对应页面
         * getCurrentPage
         * getPageCount
         * openPath http://192.168.118.28:8082/pdf.extend.js/signed_dest.pdf
         * linkTo
         */
        getFilePath: function (path) {
            // console.log(path);
        },

        tools: {
            viewOutline: true,
            viewThumbnail: true,
            viewAttachments: true,
            sidebarToggle: true,
            viewFind: true,
            firstPage: true,
            lastPage: true,
            splitToolbarButton: true,
            zoom: true,
            scaleSelect: true,
            openFile: true,
            closeFile: true,
            fullScreen: true,
            print: true,
            download: true,
            secondaryToolbar: true,
            viewBookmark: false,
            pageRotateCw: true,
            pageRotateCcw: true
        },

        getNetWorkPath: function (path) {
            console.log(path);
        }
    };

    var $multiSign = $('#multi-sign'),
        $slade = $('#slade'),
        $multiSignPad = $('#multisignpad'),
        $multiSignPadShow = $('#multisignpadshow'),
        $viewerContainer = $('#viewerContainer'),
        $mainContainer = $('#mainContainer'),
        $contextmenu = $('#delsigndiv');

    var _img,
        _div,
        signSerial = 0,
        signElArray = [],
        signImgArr = [],
        delSerial;

    var toolbarHeight = $('#toolbarContainer').height();

    function multiSignClick() {
        $slade.show();
        $multiSignPad.css("display", "block");
        $multiSignPadShow.append("<img src='company.png' />");
    }

    function multiSignStart() {
        _img = document.createElement('img');
        _div = document.createElement('div');
        _img.src = $multiSignPadShow.find('img').prop('src');

        var scale = signInfo.scale;

        _img.onload = function () {
            $(_img).css({
                width: _img.width * scale,
                height: _img.height * scale
            });
        };

        _div.appendChild(_img);
        $(_div).addClass('movesign');
        $(_div).css({
            position: 'absolute',
            textAlign: 'center'
        });

        var $viewer = $('#viewer');

        if ($viewer && $viewer.html()) {
            multiSignClose();
        }
    }

    function multiSignClose() {
        $multiSignPadShow.find('img').remove();
        $multiSignPad.hide();
        $slade.hide();
    }

    function initListeners() {
        $viewerContainer.on('click', '.page', function () {
            var pageNumber = $(this).attr('data-page-number');

            if (_div && _img) {
                var left = parseInt($(_div).css('left')),
                    top = parseInt($(_div).css('top'));

                var $curPageEl = $viewerContainer.find('[data-page-number="'+ pageNumber +'"]'),
                    __div = document.createElement('div'),
                    __img = document.createElement('img');

                __div.id = '_signSerial' + signSerial;
                __div.className = '_addSign';
                __div.setAttribute('data-index', signSerial);
                __img.src = _img.src;
                __img.width = _img.width;
                __img.height = _img.height;

                $(__div).css({
                    position: 'absolute',
                    left: left + 'px',
                    top: top + 'px'
                });

                __div.appendChild(__img);
                $curPageEl.append(__div);

                signElArray.push({
                    pageNumber: pageNumber,
                    signEl: __div,
                    scale: signInfo.scale,
                    imgWidth: _img.width,
                    imgHeight: _img.height,
                    top: top,
                    left: left
                });

                signSerial++;
            }
        });

        var offsetLeft,
            offsetTop;

        $viewerContainer.on('mouseenter', '.page', function (e) {
            var $this = $(this);
            var pageX = e.pageX,
                pageY = e.pageY;

            offsetLeft = this.offsetLeft + $mainContainer.get(0).offsetLeft,
            offsetTop = this.offsetTop + $mainContainer.get(0).offsetTop;

            if (_img && _div) {                
                var top = pageY - offsetTop - _img.height / 2 + $viewerContainer.get(0).scrollTop - toolbarHeight,
                    left = pageX - offsetLeft - _img.width / 2;

                $(_div).css({
                    top: top + 'px',
                    left: left + 'px'
                });

                $this.append(_div);
            }
        });

        $viewerContainer.on('mousemove', '.page', function (e) {
            var pageX = e.pageX,
                pageY = e.pageY;

            offsetLeft = this.offsetLeft + $mainContainer.get(0).offsetLeft,
            offsetTop = this.offsetTop + $mainContainer.get(0).offsetTop;

            if (_img && _div) {
                var top = pageY - offsetTop - _img.height / 2 + $viewerContainer.get(0).scrollTop - toolbarHeight,
                    left = pageX - offsetLeft - _img.width / 2;

                $(_div).css({
                    top: top + 'px',
                    left: left + 'px'
                });
            }
        });

        $viewerContainer.on('mouseleave', function (e) {
            var movesign = $(this).find('.movesign');

            $.each(movesign, function(i, e) {
                e.remove();
            });

            _div = null;
            _img = null;
        });

        $viewerContainer.on('contextmenu', '._addSign', function(e) {
            e.preventDefault();

            delSerial = $(this).data('index');
            
            $contextmenu.show();
            $contextmenu.css({
                top: e.pageY,
                left: e.pageX
            });
        });

        $contextmenu.on('click', 'li', function() {
            $viewerContainer.find('[data-index="'+ delSerial +'"]').remove();
            signElArray.splice(delSerial, 1, undefined);
            $contextmenu.hide();
        });
    }

    initListeners();

    return {
        pdfJsApi,
        multiSignClick,
        multiSignClose,
        multiSignStart,
        signElArray,
        signImgArr
    }
}));