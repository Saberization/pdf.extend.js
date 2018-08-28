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
        $contextmenu = $('#delsigndiv'),
        $uiPopup = $('#ui-popup'),
        $uiPopupContent = $('#ui-popup-content');

    var $tplPopup = $('#tpl-uipopup').html();

    var _img,
        _div,
        signSerial = 0,
        signElArray = [],
        newRotation = 0,
        delSerial,
        signNameArray = [],
        signNameArrayIndex = 0;

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
        var offsetLeft,
            offsetTop;

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
        }).on('mouseenter', '.page', function (e) {
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
        }).on('mousemove', '.page', function (e) {
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
        }).on('mouseleave', function (e) {
            var movesign = $(this).find('.movesign');

            $.each(movesign, function(i, e) {
                e.remove();
            });

            _div = null;
            _img = null;
        }).on('contextmenu', '._addSign', function(e) {
            e.preventDefault();

            delSerial = $(this).data('index');
            
            $contextmenu.show();
            $contextmenu.css({
                top: e.pageY,
                left: e.pageX
            });
        }).on('click', '._signature', function() {
            var signid = $(this).data('signid'),
                responseSignData = window.responseSignData;

            $.each(responseSignData, function(i, e) {
                if (e.signid == signid) {
                    var cert = e.cert;

                    if (e.isIntegrity) {
                        e.signCls = 'success';
                        e.signDescription = '签名有效，由"'+ cert.signer +'"签名，自应用本签名以来，"文档"未被修改';
                    }
                    else {
                        e.signCls = 'error';
                        e.signDescription = '签名无效，由"'+ + cert.signer + +'"签名，自应用本签名以来，"文档"已被更改或损坏';
                    }

                    var blob = Util.base64ToBlob(cert.base64Cert);

                    cert.certDownloadUrl = window.URL.createObjectURL(blob);
                    e.signdate = Util.getDate(e.signdate);

                    $uiPopupContent.html(Mustache.render($tplPopup, e));
                    $uiPopup.addClass('zoomIn animated faster');
                    $uiPopup.removeClass('hidden');
                    window.URL.revokeObjectURL(blob);
                }
            });
        });

        $uiPopup.on('click', '.ui-popup-close', function() {
            $uiPopup.removeClass('zoomIn animated faster');
            $uiPopup.addClass('hidden');
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
        newRotation,
        signNameArray,
        signNameArrayIndex
    }
}));