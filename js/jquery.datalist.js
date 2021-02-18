//-----------------jquery plugin demo
(function($) {
    $.fn.dropMenu = function(options) {
        
        if(this.length === 0) return this;
        // let elPath = $(this).selector;
        // let settings = $.extend({}, $(this).data(), options);

        
        $(this).each(function(){
            // console.log(this)
            let originInputDom = $(this);
            let originListDom = $('#'+ $(this).attr('list'))
            let newTplDom = $(this).wrap('<div class="inputList">').css('display','none')
            let originWidth = originInputDom.css('width')
            if(originWidth == '0px') originWidth = '150px';
            let parentDom = newTplDom.parent().append(`<div class="module" style="width:${originWidth};"><div class="input" title="설정 선택/추가 (Enter선택,ctrl+Enter추가/수정)"></div><dl class="dropMenu" tabindex="1"></dl></div>`)
            let inputDom = parentDom.find('.input')
            let listDom = parentDom.find('.dropMenu')
            inputDom.wrap('<div class="posrel">')
            inputDom.attr('def', $(this).attr('placeholder') )
            emptyDefFun()
            let dlArr = originListDom.find('option').each(function(){ 
                listDom.append('<li><span>'+ $(this).text() +'</span><i class="close">❌</i></li>')
            })
            // console.log('------',listDom.find('li').map(function(){return $(this).text()}).toArray())

            
            inputDom.dblclick(function(e){
                $(listDom).addClass('show')
            })

    
            inputDom.keydown(function(e){
                eventEnterEsc(e);
            });
            inputDom.keyup(function(e){
                findListFromInput();
                eventArrowUpDown(e);
                eventArrowLeftRight(e);
                if(e.key.indexOf('Arrow') !== 0 ){//not up down left right 
                    if(inputDom.text() == '') listDom.addClass('show');
                    else listDom.removeClass('show')
                }
                if(e.key !== 'Backspace' || e.key !== 'ArrowLeft' || e.key !== 'ArrowRight'){
                    if(inputDom.text() ==  inputDom.attr('def')) emptyDefFun();
                    else inputDom.removeClass('def')
                }
                listDom.addClass('show')
                addOrModify();
                
            });

            listDom.keyup(function(e){
                eventArrowUpDown(e)
                eventEnterEsc(e);
            })

                //입력한 텍스트를 리스트중에서 검색(찾은것 파란색)
                function findListFromInput(){
                    let isFound = listDom.find('li>span').filter(function(){ return $(this).text() == inputDom.text(); }).length > 0
                    if(isFound){
                        listDom.find('li span').filter(function(){ return $(this).text() == inputDom.text(); }).parent().addClass('select')
                    }else{
                        listDom.find('li').removeClass('select')
                    }
                }

                function emptyDefFun(){
                    if(inputDom.text() == '') inputDom.text( inputDom.attr('def') )
                    if(inputDom.text() == inputDom.attr('def')) inputDom.addClass('def')
                    else inputDom.removeClass('def')
                }



                function eventEnterEsc(e){
                    if(e.key == 'Enter'){
                        e.preventDefault();
                        if(listDom.hasClass('show')){
                            // console.log( listDom.find('.select span').text())
                            // console.log( inputDom.text() +'-------', listDom.find('li span'))
                            let inputText = inputDom.text();
                            // if(listDom.find('li span').filter(function(){ return $(this).text() == inputText }).length > 0 ){//같을때
                            if(listDom.find('li.select span').length > 0){
                                // listDom.focus();
                                if(listDom.find('li.select span').text() != '') inputDom.text( listDom.find('li.select span').text() );
                            }else{
                                if(inputDom.parent().parent().find('.posrel button').length > 0 ){//같을때
                                    console.log(22222, inputDom.parent().parent().find('.posrel button'))
                                    inputDom.parent().parent().find('.posrel button').click();
                                } 
                                // else {//다를때 
                                //     console.log(1111)
                                //     if(listDom.find('li.select span').text() != '') inputDom.text( listDom.find('li.select span').text() );
                                // }
                            }
                            setCursorPointer(inputDom.get(0))
                        }
                        listDom.removeClass('show')
                        $(originInputDom).attr('value', inputDom.text())
                        // console.log('enter', inputDom.get(0))
                        // alert('현재 설정으로 적용하였습니다.')
                        if(e.ctrlKey){
                            let isModify = listDom.find('li>span').filter(function(){ return $(this).text() == inputDom.text(); }).length > 0;
                            if(isModify){
                                if(typeof modifyFun == 'function') modifyFun(inputDom)
                            }else {
                                if(typeof addFun == 'function') addFun(inputDom)
                            } 
                        }else{
                            if(typeof enterFun == 'function') enterFun(inputDom)
                        }

                    }
                    if(e.key == 'Escape'){
                        listDom.removeClass('show')
                    }
                }

                function eventArrowLeftRight(e){
                    if(e.key == 'ArrowRight'){
                        if(isEndCursor(inputDom.get(0))){//커서가 뒤끝에 있을때
                        // if(getCursorPointer(this) == $(this).text().length){
                            e.preventDefault();
                            if(!listDom.hasClass('show')){
                                listDom.addClass('show');
                                // console.log('end')
                                if(typeof inputEndFun == 'function') inputEndFun()
                            } 
                        } 
                    }
                    else if(e.key == 'ArrowLeft'){
                        if(isStartCursor(inputDom.get(0))){//커서가 앞끝에 있을때
                        // if(getCursorPointer(this) == 0){
                            e.preventDefault();
                            if(!listDom.hasClass('show')){
                                listDom.addClass('show');
                                // console.log('start');
                                if(typeof inputStartFun == 'function') inputStartFun()
                            } 
                        } 
                    }
                }
                function eventArrowUpDown(e){
                    if(e.key == 'ArrowUp'){
                        e.preventDefault();
                        listDom.focus();
                        if(!listDom.hasClass('show')) listDom.addClass('show');
                        else{
                            if(listDom.find('li.select').length == 0 ) listDom.find('li:last()').addClass('select');
                            else{
                                if( listDom.find('li.select').index() == 0){
                                    listDom.find('li:last()').addClass('select');
                                    listDom.find('li:first').removeClass('select')
                                }
                                else{
                                    let thisLi = listDom.find('li.select')
                                    thisLi.prev().addClass('select');
                                    thisLi.removeClass('select')
                                }
                            }
                        }
                    }
                    else if(e.key == 'ArrowDown'){
                        e.preventDefault();
                        listDom.focus();
                        if(!listDom.hasClass('show')) listDom.addClass('show');
                        else{
                            if(listDom.find('li.select').length == 0 ) listDom.find('li:first()').addClass('select');
                            else {
                                if(listDom.find('li.select').index() == listDom.find('li').length-1){
                                    listDom.find('li:first()').addClass('select');
                                    listDom.find('li:last()').removeClass('select')
                                }
                                else{
                                    let thisLi = listDom.find('li.select')
                                    thisLi.next().addClass('select');
                                    thisLi.removeClass('select')
                                }
                            }
                        }
                    }
                }

                // ➕버튼, ✏️버튼   ----✔️
                function addOrModify(){
                    if(inputDom.text() == '' || inputDom.text() == inputDom.attr('def')) {
                        inputDom.removeClass('afterBtn')
                        inputDom.parent().find('button').remove()
                    }else{
                        inputDom.addClass('afterBtn')
                        inputDom.parent().find('button').remove()
                        let isFound = listDom.find('li>span').filter(function(){ return $(this).text() == inputDom.text(); }).length > 0
                        if(isFound){
                            inputDom.parent().append('<button class="modify">✏️</button>')
                            // listDom.find('li span').filter(function(){ return $(this).text() == inputDom.text(); }).parent().addClass('select')
                        }else{
                            inputDom.parent().append('<button class="add">➕</button>')
                            // listDom.find('li').removeClass('select')
                        } 
                    }
                }

            //추가/수정 버튼 클릭
            inputDom.parent().on('click','button',function(){
                // console.log(this, $(this).text())
                if( $(this).hasClass('modify')){
                    // console.log('modify', inputDom.text())
                    // let foundDom = listDom.find('li>span').filter(function(){ return $(this).text() == inputDom.text(); })
                    // foundDom.text(inputDom.text())
                    // listDom.addClass('show')
                    // alert('설정이 저장 되었습니다.')
                    if(typeof modifyFun == 'function') modifyFun(inputDom)
                    
                }
                else if( $(this).hasClass('add')){//새이름으로 설정 저장
                    // console.log('add', inputDom.text())
                    if(typeof addFun == 'function') addFun(inputDom)
                }
            });


            //포커스 인
            inputDom.focusin(function(){
                if(inputDom.text() == inputDom.attr('def')) inputDom.text('')
                if($(this).text() == ''){
                    listDom.addClass('show')
                } 

            })

            //포커스 아웃
            inputDom.focusout(function(){
                // let timer1 = setTimeout(function(){
                    if(listDom.hasClass('show')) listDom.focus()
                    //clearTimeout(timer1);
                // },500)
            });
            listDom.focusout(function(){
                // setTimeout(function(){
                    listDom.removeClass('show')
                // },250)
                emptyDefFun()
                addOrModify();
                listDom.find('li.select').removeClass('select')
            })

            //리스트 클릭
            listDom.on('click', '>li>span', function(e){
                e.preventDefault();
                // console.log('click ', $(this).text())
                inputDom.text($(this).text())
                setCursorPointer(inputDom.get(0))
                listDom.removeClass('show')
                addOrModify();
                if(typeof enterFun == 'function') enterFun(inputDom)
            })
            //리스트 삭제클릭
            listDom.on('click', '.close', function(e){
                e.preventDefault();
                if(confirm('삭제하겠습니까?')){
                    //삭제
                    let originSelectOption = originListDom.find('option').filter(function(){ return $(this).text() == listDom.find('li.select span').text(); });
                    if(typeof removeFun == 'function') removeFun(originSelectOption)
                    originSelectOption.remove();
                    $(this).parent().remove();
                }
            })

            //리스트 hover
            listDom.find('>li').mouseenter(function(){
                $(this).parent().find('.select').removeClass('select')
                $(this).addClass('select')
                listDom.focus();
            })
        })
        

        //삭제
        this.remove = function(){
            $(this).show()
            $(this).parent().find('.module').remove();
        }
        //스타일 적용
        this.addCss = function(){
            let style = `<style>
            /*공통*/
            /* ::-webkit-scrollbar { width: 10px; height:0; margin-right: 8px; margin-bottom: 8px;}
            ::-webkit-scrollbar-track{background:#f1f1f1;}
            ::-webkit-scrollbar-thumb{background:#888;}
            ::-webkit-scrollbar-thumb:hover{background:#555;} */

            /*input[list] {width:150px;}*/

            /*-------------------*/
            .inputList {display: inline-block; vertical-align: middle;}
            /* .inputList >* {display:inline-block; vertical-align: middle; margin: 0;} */
            .inputList button {vertical-align: middle;}
            .inputList .input {  border: 1px solid #777; -webkit-user-modify: read-write; padding: 2px; line-height: 18px; height:18px; width: inherit; font-size:13px;font-weight: bold; }
            .inputList .input.def { font-weight: unset; color:#777;}
            .dropDownIcon:after { content: '▼'; font-size: 10px; float: right; padding: 0 2px; color:#aaa;}
            .inputList .dropMenu{display:none; position: absolute; background: #fff; list-style: none; width: inherit; margin:0; z-index: 2;}
            .inputList .dropMenu >li { position: relative;  padding-left: 5px; border: 1px solid #777; margin-top: -1px; font-size: 13px; background: #efefef;}
            .inputList .dropMenu >li:focus-within {border:1px solid #ccc;}
            .inputList .dropMenu >li.select {background:#9adfff; cursor: pointer; }
            .inputList .dropMenu >li >span {display: inline-block; width: -webkit-fill-available; padding: 3px; padding-right: 18px;}
            .inputList .dropMenu >li >span:hover { cursor: pointer; }
            .inputList .dropMenu >li .close { position: absolute; right: 1px; padding: 2px; top: 1px; font-style: normal; cursor: pointer;}
            .inputList .dropMenu >li .close:hover { background:#fff}
            .inputList .status {display:none;}
            .inputList .status.show {display:inline-block!important; position: absolute;}
            .show {display: block!important;}
            .hide {display: none!important;}
            .actvie {background:#ccc;}
            .posrel {position: relative;}
            .posrel .input {overflow-x: auto; overflow: hidden; white-space: nowrap;}
            .posrel .input.afterBtn { width: calc( 100% - 35px ); }
            .posrel button { position: absolute; top: 0px; right: 0px; cursor: pointer; height: 100%; padding: 0; width: 30px;}
            </style>`;
            let moduleDom = $(this).parent().find('.module')
            if( moduleDom.find('style').length == 0 ) moduleDom.append(style);
            return this;
        }


        let enterFun, addFun, modifyFun, removeFun, inputStartFun, inputEndFun, listClickFun;
        this.setEnter = function(callback){
            enterFun = callback;
            return this;
        }
        this.setAddBtn = function(callback){
            addFun = callback;
            return this;
        }
        this.setModifyBtn = function(callback){
            modifyFun = callback;
            return this;
        }
        this.setRemoveBtn = function(callback){
            removeFun = callback;
            return this;
        }
        this.setInputStartBtn = function(callback){
            inputStartFun = callback;
            return this;
        }
        this.setInputEndBtn = function(callback){
            inputEndFun = callback;
            return this;
        }


        //리스트에 추가
        this.addOption = function (){
            let originListDom = $('#'+ $(this).attr('list'))
            let inputDom =  $(this).parent().find('.input')
            let listDom =  $(this).parent().find('.dropMenu')
            listDom.append('<li><span>'+ inputDom.text() +'</span><i class="close">❌</i></li>').addClass('show')
            originListDom.append('<option>'+ inputDom.text() +'</option>')
        }

        //마지막것 선택 
        this.selectLastItem = function(){
            let self = this;
            setTimeout(function(){
                self.each(function(){
                    // let inputDom = $(this).parent().find('.input')
                    let listDom = $(this).parent().find('.dropMenu')
                    // console.log( listDom.find('li:last()'))
                    listDom.find('li:last()').click();
                    // inputDom.text( listDom.find('li:last() span').text() ).removeClass('def')
                });
            },500)
            return this;
        }



        //-----------------------


        //커서 위치가 처음일때
        function isStartCursor(el){
            return (getCursorPointer(el) == 0) ? true : false;
        }
        //커서 위치가 끝일때
        function isEndCursor(el){
            if(typeof el.innerHTML == 'undefined') return false;
            return (getCursorPointer(el) ==  el.innerHTML.length) ? true : false;
        }

        //현재 커서 위치
        function getCursorPointer(el) {
            // anchorOffset, extentOffset, baseOffset, focusOffset; anchorNode, isCollapsed, rangeCount,
            return window.getSelection().focusOffset;
        }
        //커서 위치 지정 (마지막 또는 지정된 위치)
        function setCursorPointer(el, num=null) {
            if(num == null) num = el.innerHTML.length;//커서 위치를 젤 마지막으로 지정
            let range = document.createRange();
            let sel = window.getSelection();
            range.setStart(el.childNodes[0], num);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            el.focus();
        }

        return this;
    };
}(jQuery));

// use:
// $(function() {
//     $("input[list]").dropMenu().addCss();
//     //.remove();
// });
