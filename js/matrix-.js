
//----------------------matrix데이터 처리 함수

// matrix data is csv data

//정렬
function matrixOrder(arr, columNum=0, sortType='ASC'){
    if(sortType.toUpperCase() == 'DESC'){ var r1=-1, r2=1;}
    else{ var r1=1, r2=-1; }
    arr.sort(function custonSort(a, b) {
        if(a[columNum] == b[columNum]) return 0
        return  a[columNum] > b[columNum] ? r1 : r2;
    });
    // arr.reverse()
}

//그룹화
function matrixGroup(arr, groupCol=0){
    let rs=[];
    for(let i=0; i< arr.length; i++){
        let colVal = arr[i][groupCol];
        if(typeof rs[colVal] == 'undefined') rs[colVal] = [];
        rs[colVal].push(arr[i]);
    }
    return rs;
}

//테이블_(무조건 header가 있어야 함)
//header있는 수열을 넣는다. table>thead,tbody
function matrix2table(arr, header=''){
    let rs = '';
    if(typeof arr[0] != 'undefined'){//데이터가 있어야 함.
        rs = '<table border="1" cellspacing="0">\n';
        rs += '\t<thead>\n';
        if(header.trim().length > 0 ){
            if(header.indexOf(',') > -1 ){
                let headers = header.split(',')
                rs += '\t\t<tr><th>'+ headers.join('</th><th>') +'</th></tr>\n';
            }
        }else{
            rs += '\t\t<tr><th>'+ (arr[0].join('</th><th>')) +'</th></tr>\n';
        }
        rs += '\t</thead>\n';    
        rs += '\t<tbody>\n';
        // let startNum = (header.trim().length > 0) ? 0 : 1;
        let startNum = 1;
        for(let i=startNum; i < arr.length; i++){
            rs += '\t\t<tr><td>'+ arr[i].join('</td><td>') +'</td></tr>\n';
        }
        rs += '\t</tbody>\n</table>\n';
    }
    return rs;
}

//검색
function matrixSearch(arr, findCol, findName, callback=null){
    if(typeof findCol == 'string') findCol = matrixIndex(arr, findCol);
//     console.log(findCol)
    if(callback == null){
        callback = function(row){
            return row[findCol] == findName;
        }
    }
    return arr.filter(function(row){
        return callback(row);
    })
}

    //인덱스      (array중에서 해당이름에 속한 열번호 찾기)
    function matrixIndex(matrixArr, findNames='', findRowNum = 0){
        let headerRow = matrixArr[findRowNum];
        if(typeof headerRow != 'undefined'){
            if(findNames.indexOf('|') > -1){
                let names = findNames.split('|');
                for (let i = 0; i < names.length; i++) {
                    for (let colNum = 0; colNum < headerRow.length; colNum++) {//열데이터
                        if(names[i].trim() == headerRow[colNum].trim()) return colNum;
                    }
                }
            }else{
                for (let colNum = 0; colNum < headerRow.length; colNum++) {//열데이터
                    if(findNames.trim() == headerRow[colNum].trim()) return colNum
                }
            }
        }
        return -1;
    }




//-----
// var testArray = [
//     [3,10,'BBB'],[3,20,'AAA'], [1,9,'CCC'], [1,1,'DDD'], [1,22,'EEE'],['aa','',''],['','',''], [NaN,22,'EEE']
// ];
// testArray.unshift(['aaa','bbb','eee'])

// // matrixOrder(testArray,2);//3번째 열 정렬
// matrixOrder(testArray,0, 'DESC');//1번째 열 정렬
// console.log('data', testArray)

// console.log('group', matrixGroup(testArray, 2));//그룹화
// console.log('table', matrix2table(testArray))
// console.log('search', matrixSearch(testArray, 'bbb', 1))



//선택한 열만 획득
function matrixColum(arr, cols, isUnique=false){
    let rs = [];
    cols = cols.toString()
    if(cols.indexOf(',') > -1){
        console.log(111)
        let col = cols.split(',');
        for(let i=0; i<arr.length; i++){
            let row = []
            for(let k=0; k<col.length; k++){
                let key=col[k];
                if(typeof arr[i][key] != 'undefined') row.push(arr[i][key]) 
            }
            if(row.length > 0) rs.push(row);
        }
    } else {
       let col = cols;
       for(let i=0; i<arr.length; i++){
            for(let j=0; j<arr[i].length; j++){
                if(j == col) rs.push( arr[i][col] ) 
            }
        }
        if(isUnique) rs = [[...new Set(rs)]];
    }
    return rs; 
}
// console.log(matrixColum(testArray,'0', 1))




//빈 데이터 행 개수가 몇개 이상 인것 만 추출 (필드에 대해 처리)
function matrixRemoveEmptyRow(arr, eq=0, type='val'){//공백행 삭제
    let rs = []; 
    for(let i = 0; i < arr.length; i++){
        let emptyLength = 0; 
        let dataLength = 0; 
        for(let j = 0; j < arr[i].length; j++){
            if(arr[i][j] == '') emptyLength++;
            else dataLength++;
        }
        if(emptyLength > 0 ){
            if(type == 'val' ){
                if(dataLength > eq) rs.push(arr[i]);
            }else{
                if(dataLength > 0){
                    if(type == '>'){
                        if(!(emptyLength > eq)) rs.push(arr[i])
                    }else if(type == '='){
                        if(!(emptyLength == eq && emptyLength !=0) ) rs.push(arr[i])
                    }else if(type == '<'){
                        if(!(emptyLength == eq)) rs.push(arr[i])
                    }
                }

            }
        }else{
            rs.push(arr[i])
        }

    }
    return rs; 
}
// console.log(matrixRemoveEmptyRow(testArray));
// console.log(matrixRemoveEmptyRow(testArray,1,'>'));



//리스트데이터 2차수열을 kv방식으로 전환(선택 열 추출 가능) //[[],[]] ===> [{},{}]
function list_int2kv(arr, header=''){
    let rs = [], keys;
    if(arr.length > 1){
        if(header.trim() == '') keys = arr[0];
        else if(header.indexOf(',') > -1) keys = header.split(',');
        else keys = [header];
        for(let i=1; i < arr.length; i++){
            let rowIndex = i-1;
            if(typeof rs[rowIndex] == 'undefined') rs[rowIndex] = {};
            for(let j=0; j < keys.length; j++){
                let key = String(keys[j]);
                rs[rowIndex][key] = arr[i][j]
            }
        }
    }
    return rs;
}

//리스트데이터 kv방식을 2차수열로 전환(선택 열 추출 가능) //[{},{}] ===> [[],[]]
function list_kv2int(data, header='', headerRow=0){ //열순서가 있음
    let rs =[], keys;
    if(header.trim() == '') keys = Object.keys(data[headerRow]);
    else if(header.indexOf(',') > -1) keys = header.split(',');
    else keys = [header];
    for (let i = 0; i < data.length; i++) {
        if(typeof rs[i] == 'undefined') rs[i] = [];
        for(let j = 0; j <keys.length; j++) {
            let key = keys[j];
            rs[i][j] = (typeof data[i][key] == 'undefined') ? '' : data[i][key]
        }
    }
    rs.unshift(keys)
    return rs;
}
// console.log(testArray)
// arr1 = list_int2kv(testArray,'aaa,eee');
// console.log(arr1, list_kv2int(arr1, 'eee,aaa,bb'))
// console.log(arr1, list_kv2int(arr1))



//------TODO
//열 범위로 추출 (열번호인것을 처리/추출)
//행 범위로 추출 (행번호인것을 처리/추출)(우수행/기수행 인것에 처리)
function matrixChange(arr, colNum=0, callback){
    for(let i = 0; i < arr.length; i++){
        arr[i][colNum] = callback(arr[i][colNum], i, arr[i]);
        if(typeof arr[i][colNum] == 'undefined') arr[i][colNum] = '';
    }
    return arr;
}
// console.log('callback', matrixChange(testArray, 0, function(colVal,i,row){
// //     if(i==5) return  row[2]
// //     else return colVal
//     return  row[2]
// }));






//------------------------
function makeRangeArray(start, stop, step) {
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
}
// console.log(makeRangeArray(5, 30));//5~30