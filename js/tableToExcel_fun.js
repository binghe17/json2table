

        //Table to Excel File
        function table2excel(tableDom, info=null, saveFilename='testTable.xlsx', sheetName='Sheet 1'){ 
            let dom = (tableDom instanceof jQuery) ? tableDom.get(0) : document.querySelector(tableDom);
            if(dom == null) {
                console.log('table태그을 찾을수 없어서 엑셀 파일을 생성할수 없습니다.');
                return;
            }
            var wb = XLSX.utils.book_new();// step 1. workbook 생성
            var newWorksheet = XLSX.utils.table_to_sheet(dom);// step 2. 시트 만들기 getExcelData
            // var newWorksheet = XLSX.utils.table_to_sheet(dom, {raw:true, type:'string'});// step 2. 시트 만들기 getExcelData
            // console.log(newWorksheet)

            // info = {
            //     colWidth: [20,30],
            //     colType: {3:'s'}
            // }
            if(info != null){

                if(typeof info['colWidth'] != 'undefined'){
                    let colDataset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');//26개열까지 지원
                    let rangeArr = newWorksheet['!ref'].split(':');
                    let startColIndex = 0, startRowIndex = 0;
                    let maxColIndex =  rangeArr[1].match(/[A-Z]+/g)[0]; //max
                    maxColIndex = colDataset.indexOf( maxColIndex );
                    let maxRowIndex = parseInt(rangeArr[1].match(/\d+/g)[0]); //max
                    // console.log(typeof info['colWidth'], startColIndex, startRowIndex, maxColIndex, maxRowIndex, newWorksheet)

                    //col type:  s=string   //--------- sheet["A1"].t= "s",
                    if(typeof info['colType'] != 'undefined'){
                        if(maxRowIndex >1){
                            for (let rowIndex = 1; rowIndex < maxRowIndex+1; rowIndex++) {
                                for (const colIndex in info['colType']) {
                                    let changeType = info['colType'][colIndex];
                                    let enCol = colDataset[colIndex];
                                    let name = enCol + rowIndex;
                                    // console.log(name, changeType)
                                    if(newWorksheet[name].t != 'z') newWorksheet[name].t = changeType;
                                }
                            }
                        }
                    }

                    //col width     //--------- newWorksheet["!cols"] = [{wpx: 60}, {wpx: 60}, {wpx: 200}, {wpx: 100}, {wpx: 50}, {wpx: 50}]; 
                    if(typeof info['colWidth'] != 'undefined'){
                        if(typeof newWorksheet["!cols"] == 'undefined') newWorksheet["!cols"] = [];
                        let type = typeof info['colWidth'];
                        if(type == 'string'){
                            let colWidths = info['colWidth'].split(',');
                            colWidths.forEach(function(col,i){
                                if(col != '' && i <= maxColIndex) newWorksheet["!cols"].push({wpx: parseInt(col)})
                            })
                        }else if(type == 'number'){
                            for (let i = 0; i < maxColIndex+1; i++) {
                                newWorksheet["!cols"].push({wpx: info['colWidth']})
                            }
                        }else if(type == 'object'){
                            info['colWidth'].forEach(function(col,i){
                                // console.log(i, maxColIndex)
                                if(col != '' && i <= maxColIndex) newWorksheet["!cols"].push({wpx: parseInt(col)})
                            })
                        }
                    }

                    //참고 https://docs.sheetjs.com/
                    //참고 https://github.com/SheetJS/sheetjs/pull/509
    
                    //value
                    // newWorksheet["A1"].v = '11111';

                    //equation
                    // newWorksheet['E1'].f = 'SUM(E2:E5)';

                    //Hyperlinks
                    // newWorksheet['A3'].l = { Target:"http://sheetjs.com", Tooltip:"Find us @ SheetJS.com!" };
                    // newWorksheet['A2'].l = { Target:"#E2" }; /* link to cell E2 */

                    //Cell Comments
                    // if(!ws.A1.c) ws.A1.c = [];
                    // ws.A1.c.push({a:"SheetJS", t:"This comment is visible"});
                    // if(!ws.A2.c) ws.A2.c = [];
                    // ws.A2.c.hidden = true;
                    // ws.A2.c.push({a:"SheetJS", t:"This comment will be hidden"});

                    //merge
                    // if(typeof newWorksheet["!merges"] == 'undefined') newWorksheet["!merges"] = [];
                    // newWorksheet["!merges"].push({ s: { c: 0, r: 0 },  e: { c: 3, r: 2 } });//s Start //e End
                    

                    // b	Boolean: value interpreted as JS boolean
                    // e	Error: value is a numeric code and w property stores common name **
                    // n	Number: value is a JS number **
                    // d	Date: value is a JS Date object or string to be parsed as Date **
                    // s	Text: value interpreted as JS string and written as text **
                    // z	Stub: blank stub cell that is ignored by data processing utilities **

                    //--------x
                    //style
                    // newWorksheet["A1"].s = {
                    //     font: { name: 'Song Style', sz: 24, bold: true, underline: true, color: { rgb: "FFFFAA00" } },
                    //     alignment: { horizontal: "center", vertical: "center", wrap_text: true },
                    //     fill: { bgColor: { rgb: 'ffff00' } }
                    // };

                    // let img = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQEBAVFRUVFxYVFRUQFRUVFhcaGBUWFhcXFRcYHiggGRolGxcVITIhJSk3Li4uFx8zODMsNyotLy0BCgoKDg0OGhAQGzclHyAtLS0tLS8tLS0tLTAtLTctLS0tLS0vLS0vLS8tLS0vLS0rLS0tLS0tLS0tLS0tLS0tLf/AABEIASsAqAMBEQACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQMEBQYCBwj/xABOEAABAwICBAcJDQUIAgMAAAABAAIDBBESIQUGMXEHEyI0QVGzMjVhdYGRkqGxFBYjQlJjcnN0tLXB4TOCssLRJDZDU2Ki8PFEgxVUk//EABsBAQADAQEBAQAAAAAAAAAAAAABAwQCBgUH/8QANhEAAgECAggDBwQCAwEAAAAAAAECAxEEBRIhMTI0UYGxE0GRFBUiYXGh8AZCwdFS4SMz8VP/2gAMAwEAAhEDEQA/ANtq3qzDVwCpne9z5HPOTrbHFvVmcrrJSpKcdKR9zGY+ph6nhUkklbsWvvGo/nPT/RWezwMvvbEc16B7xqP5z0/0T2eA97YjmvQPeNR/Oen+iezwHvbEc16B7xqP5z0/0T2eA97YjmvQPeNR/Oen+iezwHvbEc16B7xqP5z0/wBE9ngPe2I5r0D3jUfznp/ons8B72xHNege8aj+c9P9E9ngPe2I5r0D3jUfznp/ons8B72xHNege8aj+c9P9E9ngPe2I5r0D3jUfznp/ons8B72xHNege8aj+c9P9E9ngPe2I5r0D3jUfznp/ons8B72xHNege8aj+c9P8ARPZ4D3tiOa9A941H856f6J7PAe9sRzXoHvGo/nPT/RPZ4D3tiOa9A941H856f6J7PAe9sRzXoHvGo/nPT/RPZ4D3tiOa9A941H856f6J7PAe9sRzXoVWsmrMNJAaiB8jXxuYRd19rg3qyOd1XVpKEdKJqwePqV6vhVUmnfsXmovMIt8navVtDcRizPipdOyL9XGAEAIAQAgBACAEAIAQAgBACAEAIAQAgBACAoNeuYS74+1Yqa+4zflnFR69mGovMIt8navShuIZnxUunZF+rjACAEAIAQAgBACAEAIAQAgBACAEAIAQAgBAUGvXMJd8fasVNfcZvyzio9ezDUXmEW+TtXpQ3EMz4qXTsi/VxgBACAEAIAQCEqG0gNvlsqpVkjpRGZKjLIgdSmEnLWdKIy556z5yrDqyOHyvGeOw8OYUkaKOm17htAI6bXy/qhDpkuKqY7IHP/mxDhxaH0IBACAEAIAQFBr1zCXfH2rFTX3Gb8s4qPXsw1F5hFvk7V6UNxDM+Kl07Iv1cYAQAgBACAbkktvVVSpokpXGtuZP9As7npazqxxI89W+6mN3qSJSGHSDp68sitSSR3rOW1Db2238CkNMaqWNIHQAQbXyO8IE2K6xGWfR1WUkEWc25JdYnZbrKHS1kqn0uGvEcpOYuHFtgOixKFcoeaLgFCsVACAEAICg165hLvj7Vipr7jN+WcVHr2Yai8wi3ydq9KG4hmfFS6dkX6uMAIAQAgOXusuZSsibFczSDHPwi5vsIFxkT0+RZWpXuy7wmlcdqwSw4fOd6LX5HMHZ6xpkey7iTmtEUdN3OZGZ5ut58879K7CkEj2DO4yG/LcoJSZFDmHMX2dzvz2bkOtewZwSuJs0N6iPXl6lIdlrIdRIYxy7WJ6GknLMEk7Mr5qUTqewWV2JhJ2mxucr+A712kZ6srKyJmrNfb4Fxy2suQbf6Nvm8qmcfMzU5+TNIqy4EAIAQFBr1zCXfH2rFTX3Gb8s4qPXsw1F5hFvk7V6UNxDM+Kl07Iv1cYAQAgBARZpL5LJUndncUV8ETYzyGlxJ6cg3POyqnXdrJXL5SlLaP5uuXdGwXv5d6iknN3OLWIddpDihZoBJNsvztsW5ux3CnpMZYZX2L2kC+werF19aHTUVqR0acuBABaDkSTc+ZLDTSJBlYMi4AWsOg3XVyvRvsFlmJIAcPCR+Z6FJAxMQB5LEnlX3+DapSZzKcVtKqYRudkWuLRcgdFtlrbP+lak1tMlSUZPUMPxHNlgQcVxlYA7eu/SuilXNjomtE0TX9Ox3gIyP/PCqGrM1Rd0TFB0CAEBQa9cwl3x9qxU19xm/LOKj17MNReYRb5O1elDcQzPipdOyL9XGAEAICNU1IaQza52zweErmd9FtBDDm3PKN93WvmuMnL4i69lqOjMwcm4urbx2EWZDqXvebAgAEdHhC007ncUkNx0haCbAknFdx6c7ZDyqyx1p3HW0xHdv/K5/opIck9iOZZnm4Yw+HFkPIouFFbWQJWWdypAMgbZHyDo8iWLYyXkjlwle0vba2ZDb5nqH/CpRxJqOojPrPiy5coCwtmRY2O3r61akzDUlFsWerbZ1rtuc9l9m2w27Bku0Z2Vz6ci5D3eoOAFrA9fX5V1c5JeqWl+Le+Mjku5bQ3aLWDreduXgVc4l9Jm4Y8OAINwcwfAVUXHSAEBQa9cwl3x9qxU19xm/LOKj17MNReYRb5O1elDcQzPipdOyL9XGAEAICl1jvE33U0/swA5tu6aXAeQi5PnTU9TLaFGVWooR2sgU+nYJhbHgJ/50qmphlJfC7F9TDV6L+ODJsVNG7MvDjtv+iywwU09fqVOoOTkxtJZG5xOfJsVuSsiYtSdm7EFlRUOsXRubc9zgdYDrJAzTWWSUFsdxp1XVXsIz5j+dh61I0Yczp089iX7B0AXJztkAUsRaPkMCoe1thC5ueyzndYOWwKbCTXmxl1RUXIMcpaLYREwtJ2k4iRkBYb10omapV5A6KQux+5bm2x1hY7Bck2vbq867TsZpLS12OH6NkPKJYwnPC9/c2GQFi7yqdJHHhyZDrJIYQTNW7RYsj5W3qLvbZHIthh5PZrIeiNKiqnbR0ocwPxF88vKkta7i3ZmbAXsq9JG14KpTp6clZHptPEGNaxuxoDRuAsFyZxxACAoNeuYS74+1Yqa+4zflnFR69mGovMIt8navShuIZnxUunZF+rjACAEBW6xx4qSYfNuPmFx7ENODlo4iD+aPKolKPbyRMikcNjiNxIXZlnRpy2xT6Ehukp27JXD1+1LGd4DDS/Z/A43WGqb/i33gKGcPKcM/L7nXvpqvljzfquSHkuH8rnJ1qqvlDzH+qXOXktDmxqTWiq+UPMlyPclDmyPJrJVH/E9SjSJWTUF5shTabqXbZXeTJNJnaynDLyfqV1RWSO7qRx/eKhzZasBh47ILrr7ldIVw2XRjGOxWNhwVQYq17/kRO87nMHsBUxPl5vK1FLm+x62uzzoIAQFBr1zCXfH2rFTX3Gb8s4qPXsw1F5hFvk7V6UNxDM+Kl07Iv1cYAQAgGqlmJjm9YI84spJi7ST+Z45ELZFQj9AburkqMqxFMiLpmN5icY3FrhyhhNr22jzX9SvoOKmtLYfOzKFWWHk6TaktersOav1LZcDnAEPFiDY2d/2PWt+Kw8PDbith4HK81xcMeqVWq2patb6o0UlJCBcsaANpIAC+Ra57rx5pXcjh1HF/lt8wUHXjVOf3GDTREXDGkdYAKhqw8ebWqRmtOTtjc8gABg6Mrn/ALyX1MPQh4acltPHZnmmKljHTpVGkrLU/UqdFh/F4nuJLuVn0Dot7V87EOOnaPke0yuFXwFKq229esdlKoPoMivXLOGeh8EEOdRJ4I2j/eT+S7ifDzmW5H6npK6PhggBAUGvXMJd8fasVNfcZvyzio9ezDUXmEW+TtXpQ3EMz4qXTsi/VxgBACAQoDx+tjwTys+TI8eZxQ93h5aVGD5pCxqxEsecuiso6G8E74hsJEsfnzHnt5l9ihPxKVnt2H5f+oMG8Hi1UhsumvW/22Gm1lon1VI6OJ1i7C4XNg4XBwk9R/JfKpyVKr8Xlc9XWi8Vhk6b3rMkmncIeL4x2LBg4zLFfDbFvvmq9JaV/mbFTfh6F9drX/kq9A0T6WlDJXXLcTjbMNFybA9X9V3UkqtT4TNQi8Lh26jva7MnpYmWRsXyiXv+iD+ZX0a0lSp/Q8xkuFljMU5S83d/z/RMcviH6dZJWRGlKg5ZGKhnB6pwTQ2pJH/KlNtzWMHtuuo7DzmbyvWS5I3K6PlAgBAUGvXMJd8fasVNfcZvyzio9ezDUXmEW+TtXpQ3EMz4qXTsi/VxgBACACgPKdZY8NbMP9V/SaHfmh7PLZaWFh9OxEiXcTVIfXZUVWm4yA2ZoziOI+FpyePNn5FqwlXRnbmfB/UeB9pwjktsdfT819DTaGnD4Rne2Xk2j1ELjG09Gq3zPk/p7EeJhFF7YNr+u9uhDGmb1rqTAcow7FY7dp/dsRn1ghVOlal4l/M+pHFXxLo28r3F05NhiI+UbeTafYrMHDSq35GHPq/h4VxW2TS6bX2sY/R7cRdMfjnk+Bgyb59q5xlXSno8j6X6bwXgYZVHtl+fckPWM9CRpVBwyOVDOT2bg4gwaOi/1F7vPI63qsu1sPK5lK+Jl0NOpMIIAQFBr1zCXfH2rFTX3Gb8s4qPXsw1F5hFvk7V6UNxDM+Kl07Iv1cYAQAgBAeba9R4a2/ymMPtb/Kh6vJZXw1uTZTRrtH05Ehq7KWNTNuLHYo2ayXFSVmc6pSYHPpz8Xub9LdrP9pI/dW7EPxKMZry2nhsFReBzOrh3sl8US/dC3GZMIxEBpd02BJA3XJXz7u1j0ShFS0vMy+tspc5sLTm7k7gc3H0R6wt1B+FRlNnn8bSeNzKnho7I631IWEAADIDIBfNbu7nuoxUUktiGnqAyLKoOWMFQzk931UhwUVO3qiYfKWgn2qxbDx2KlpVpv5stkKAQAgKDXrmEu+PtWKmvuM35ZxUevZhqLzCLfJ2r0obiGZ8VLp2Rfq4wAgBACAwXCJFaaJ/WxzfM4H+ZD0mQy+CcfmmZmNdI+2ySxWFLOHqGdRIjCY545R0HC/6J6fIf4itGGekpUufdHm/1BSjT8LGf/OST+j1GhfXRf5jfOFT7PV/xOFmmDt/2L1MnMS+Z8p+i3dtJ9g/dVuLeio0l5I7/TlONV1cY9bnJpfRHOEkgDacgsJ6ZtJXEkpZLXwG27/mSFXiw5kGqiLTZwsoCkpbCNhLshtOQ8uSghu2s+iKePC1rR8UAeYWVh4mTu2x1CAQAgKDXrmEu+PtWKmvuM35ZxUevZhqLzCLfJ2r0obiGZ8VLp2Rfq4wAgBACAx3CLH8HE/qeW+k2/8AKh9zIpWqzj8v5MYxdI9GyQwrsqkJIlr6jiU1CLlJ2SIki+thaKjFOS16z8w/UObyxNeUKNS9Jpalsv8A+jDlrPOIbJWPFUVOLaWs9NkGaTw1eEKlTRpa215bDnEQbhfEas7H6hGUKsFJa09ZxJUP+WfOoOfDhyIVRK47STvUEaKjsQ7oKHjKqBnypox5MYv6lHmU4mWjRm/kz38Kw8aKgBACAoNeuYS74+1Yqa+4zflnFR69mGovMIt8navShuIZnxUunZF+rjACAEAICk1r0Y+opy1ndNIe0HpIuLeYlSbsuxKw9dSlsepnm7mOY4teC1w2gixHkUo9fGcZx0ou6HWOXaOWJK5a8LR05XfkeV/U2bTwdKMKaT8S6d/L0Ir19Y/L4jTkLENOXLLkNkr42LoKFmvM/Sv05mtTFRdKaSUEkvn9RmRYj07Ikqg4ZreDvV2WSoZVPaWxR3c0uFsbrEDD4Be9/B5pS8z5GZ4uEabpRd2/setro86CAEAICg165hLvj7Vipr7jN+WcVHr2Yai8wi3ydq9KG4hmfFS6dkX6uMAIAQAgBAQ6/RkM4tLGHdRIzG4jMKbl1HEVaLvCVvzkUFVqXGc4pXN8DgHD8ipUrO59BZvUcHGcU7oqKjU2pHcOY8by0+Yi3rX1YY6l5qx4GrlGJ8pJ9WV8urFaP8An6LmH+ZXLGUX5md5biY/s7Ed2rlb/APWf/t/quvaqP+QWAxP+D+39nI1Xrj/4zvKWD2uXEsVR/wAi2OBxH+D+39jsepVc7bG1v03t/luqZYul9ehrp4HEL5dSxpuDqQ/tahresRtLvW63sXyWtZ733yowSjDWktrNFovUiigs4x8a4fGm5Xmb3PqUWMFbMa9XVey+Rog2ykwnSAEAIAQFBr1zCXfH2rFTX3Gb8s4qPXsw1F5hFvk7V6UNxDM+Kl07Iv1cYAQAgBACAEAIBLIAsgFQAgCyALIAQAgBACAEAICg165hLvj7Vipr7jN+WcVHr2Yai8wi3ydq9KG4hmfFS6dkX6uMAIAQAgBACAEAIAQAgBACAEAIAQAgBACAEBQa9cwl3x9qxU19xm/LOKj17MTUU/2CLfJ2r0obiGZ8VLp2Rf3CuMAXCAMQ60AXCAMQ60AXHWgC4QBcIAuEAXCALjrQBdAF0AXQBdAF0AXCALhAF0BQ69H+wS74+1Yqa+4zflnFR69mN6kD+wxb5O1elD/rQzPiZdOxe2VxgCyAMKAMKAMKAMKAMKAMKAMKAXCgDCgFsgCyAXCgDCgDCgDCgDCgCyAoteeYS74+1Yqa+4zflnFR69mJqNzCLfJ2r0obiGZ8VLp2RcVkb3MIjNnXFje3SL52PRfoVxgIkUcwDgS7ORxu3CThs3DYuda1/B17EAOZIXguL9jMgDgvjBdcAmxs3Z/q29QHPEzgZk3wuPJJdnyDZuI5Xsdt9p2IDtrJLEYnm5zIADuk5YiANoHTkOhATYS7CMW3pyt6rn2oDtACAEAtkAIBUAIBUAIDHaa1kc5+COUww8b7nEzIzLLNMASYoG2LW2wkF7tpBAGV1rp0NV2ru17bElzf+iyMVq0vPZ5dW+X/AKQqzSdNDEJxpKtj7q73jjQ0sLGuEkRYbZvbkBsPQuoU5ydtBMvq0HSjKU4qytsb89ltbNDq9pp0x4mbAZMDZWSRX4qeJ1rSxXzGZALbm1xmbhUVaWjrWzZ80+TM0opWa1p/n5+WvVSclBr1zCXfH2rFTX3Gb8s4qPXsxNRuYRb5O1elDcQzPiZdOyLDTlYYKaWYOa0xsL7yZtyF7HMbdgz2kK4wFRQaYnlExjLJXNjkwcUBxeNkkzG3u85uDWG2K2fRtQD1JWzOdDZ73RvlsHyMaxz2+5pnm4AHJD2ss6wvbpGZA41e0nUzcXx7cOJgc5vEvZZ2EEi7jlY329SAl1+knsnDBgwjibtcDjfx0ro+QQbAMtiORvn3O1AQBpmb3PA7GxjjTOme6oHdljY7gYXAAHEST0C2XUBN93TETNjYXSYw2IOHJZenhf8ACOGxoc8k9JzAvsQD8tbJxJdgdHICGkOhfOL5XLRGRjaRscDl0gG4QFa/SdQaeocSMUUjG4mM4ghuGKSRzhKZByWPJ2ZgdBzQHegdIySSMY+XEcExcCWXNnw4CcAGwOeNg8I2IDQhAKgFQAgGqkkMcW7Q0kb7ZKVtIZjPcbH6JoHNc34N9FOHPcG3Iex0pxHIOLXS7dpNulatJxrzT89Jf1/B3iEtP6NW/j7FVWUbntdGyqjF+Py4yIvcyWSHHG+TZxj2NlGPPCS3PMKyM0ndx5eqT7cjXisVTqUnCL1/D9NSezkthqK2ljhn0ayBoa1jpImhufwXuWQ2v0i7IzvAVEZOcajl9et//TLFLw2vp+elzSrOcFBr1zCXfH2rFTX3Gb8s4qPXsxNRuYRb5O1elDcQzPiZdOyL4i6uMBwIm4i+3KIDSc9gJIH+4+dAQYNCQMGECQtDSzBJNNJGWluHCY3vLSLG1iEB1HoWka4ObSwtcCCC2JgII2EEDIoCYWAkOIFxexIFxfbY9CAbZSRhjIwwYWBoYCL4cIs21+kDp2oBmfRNPIS6SCN5JxXkY1+eFrbjFe2TGDL5KA5boWkAwimhAvewiYBfZewG3MoBWaIpmtexsDGCUFsnFtDC4EYSCW2OzJAOQaPjY/jBiLgC0F8kj7BxaSAHuIFy1vmQEsIAQCoAQAgMbX0klK18Ba91I5/GRyRR8c6A48ZjkisS6LFmHAGwNiBYE6lJTs/3Ws/K/XnzO3aaSep/YrGmhwkMrzI7O0dNTxvcTnYGIMJ6fBtOzK3TU764+r/kr8B+bXqjS6GoppJhV1DOLws4uCEkExsNi58hBI4x2FuQvhAtcklUzklHQj1f55FkmraK2d/zyNAqTgoNeuYS74+1Yqa+4zflnFR69mJqNzCLfJ2r0obiGZ8VLp2RfK4wAgBACARACAEAIBUAIBQgBAKgBACAEAIAQAgKDXrmEu+PtWKmvuM35ZxUevZiajcwi3ydq9KG4hmfEy6dkX4VxgIempnRU00jDZzIpHNO2xawkGx8IQHnugNb62amZI+Rpcf/AIkkhjBzqrfFNlbpYAPB0ICfwoaz1VBDO+meGmOKme3E1rs5J5I3XuPktCAyNHwiaSdpVtIZWcUaUSkcWy+P/wCM903vbZxmdvJsQHGqHCLpKpjgdLKwmSuZTutEwXjMReRsyN+lAW+q+u1fUUJnklaX+54JLiNg5T9JVVO42At+ziYPJdAaDWTWKpgqq6KN4DYNGOq4wWtNpQ6UBxJGY5IyOSAg6x611kNRpWOOQBtLSRTQgsacL3DlEkjlDwFAZTTfCPpOLRsNSyVnGPZSFxMbCLyv0mH2FrbKaH0T1lAa7X7WqrpJ2MgkDWmhqqggsa74SKPEw5jZfoQFPqlr1X1NfLTyyNLG6NiqgBGwHjX0tNKTcDZikebbM0Bda6a0VdLQVc8LwHww0L2EsaQHTSlslwRnceboQFfoDXOum0O+sfI0yto6mcEMaBjjnlY02ta2FrRZAc8GuutdXVVNFUSNc2ShlqHhrGtvI2ulgBuBkMDWiyAutU9Y6qo0jLTyvBjbSxzABrQcbpC0m4F7WGxAYbQXCRpObR8tQ+Zpka2sIIiYB8CyjLMrW2zSefwID2fQs7pKaGR5u58UbnHZcuYCct5QE1AUGvXMJd8fasVNfcZvyzio9ezE1G5hFvk7V6UNxDM+Jl07IvwrjAV+snMqn6iXs3IDyPVTmce7QP3+RAWnDjzar+po/vcqA8+0d3+Z9hH4KgOODv8AY0njSPsCgNDqL3rP2Sl/GK5Aa3XPn2lPEj/4p0BV6487079gg9iAwOs/eWm+r0f2mmkB6Dwrc6j8V1/ZFAZ3g/76zeJoPuNEgNNwld6tIfZ9F/eCgKfVP+7svi6s+9ToDjgW59ReK5/xSdAaXULvxP8AYIe1cgPMNVO9E/0dI9no5AfSGrfMqb6iLs2oCxQFBr1zCXfH2rFTX3Gb8s4qPXsJqNzCLfJ2r0obiGZ8TLp2RfhXGAr9ZOZVP1EvZuQHkeqnM492gfv8iAtOHHm1X9TR/e5UB59o7v8AM+wj8FQHHB3+xpPGkfYFAaHUXvWfslL+MVyA1uufPtKeJH/xToCr1x53p37BB7EBgdZ+8tN9Xo/tNNID0HhW51H4rr+yKAzvB/31m8TQfcaJAabhK71aQ+z6L+8FAU+qf93ZfF1Z96nQHHAtz6i8Vz/ik6A0uoXfif7BD2rkB5hqp3on+jpHs9HID6Q1b5lTfURdm1AWKAoNeuYS74+1Yqa+4zflnFR69hNRuYRb5O1elDcQzPipdOyL8K4wFfrJzKp+ol7NyA8j1U5nHu0D9/kQFpw482q/qaP73KgPPtHd/mfYR+CoDjg7/Y0njSPsCgNDqL3rP2Sl/GK5Aa3XPn2lPEj/AOKdAVeuPO9O/YIPYgMDrP3lpvq9H9pppAeg8K3Oo/Fdf2RQGd4P++s3iaD7jRIDTcJXerSH2fRf3goCn1T/ALuy+Lqz71OgOOBbn1F4rn/FJ0BpdQu/E/2CHtXIDzDVTvRP9HSPZ6OQH0hq3zKm+oi7NqAsUBQa98wl3x9qxU19xm/LOKj17Cajcwi3ydq9KG4hmfEy6dkX4VxgK/WTmVT9RL2bkB5HqpzOPdoH7/IgLThx5tV/U0f3uVAefaO7/M+wj8FQHHB3+xpPGkfYFAaHUXvWfslL+MVyA1uufPtKeJH/AMU6Aq9ced6d+wQexAYHWfvLTfV6P7TTSA9B4VudR+K6/sigM7wf99ZvE0H3GiQGm4Su9WkPs+i/vBQFPqn/AHdl8XVn3qdAccC3PqLxXP8Aik6A0uoXfif7BD2rkB5hqp3on+jpHs9HID6Q1b5lTfURdm1AWKAoNe+YS74+1Yqa+4zflnFR69jnUXmEW+TtXpQ3EMz4mXTsi/VxgG6mBsjHRvF2vaWuFyLhwsRcZjI9CAqKTVKhiYI44LNHuew4yU82kMsG13xXuJ8PTcIB3TmrdJWteyqi4wPaxrhjkbcRvL2DkOFrOcTl1oCui1A0W2cVLaW0oj4oP42c8jiPc+Gxfb9lyb2v07c0Amj+D/RdOGNhpcIZKJ2/Czm0gbhDs3m+WVjl4EBzTavaIponwNaxjGMYx7TNJyWsmdOwEl9xaSVzuvlgHKwQE6u0ZQSyzulDTI+nNPPeRwPEZuc1wDgGjl3xCxGIZ5hAN1ugtHSvkfKxpdXRtif8LIOOY1t2taA7Kwzu2xQFfV6l6FkgFPJC0xRuihDTPMMLmOlMUeIPvivVSZE3PGDqFgLLSmg9HVbjJO1rzFHJAXca9obG8FsjDhcB0EX2i20EICHo7VzQ8ErpoWsbI6m4pzuPkP8AZ42shIIc+wDRGxpdtu3M3ugJdfofRtVEYJQ17KgMiLRK8cZ7nLntaMLgbtIcTbPLNAd0mp9BFTmkjgtC6N8JZxkp5D3Oe9uIuxZuc43vfPagDQup1BRPZJTQYHRxOgYeMldaN0rpnNs5xB5bnG5zzte2SAk0GrlJBM6oiiwyOjETnY5DdjTiDbOcRt6bXQFXS8HeioojBHS2jcJAW8dOb8aIxJmX3zEUe7Dla5uBpKaBsbGxsFmsaGtFybBosBc5nIdKAdQGe1+dbR8p8MfasVNfcZuy12xMevYyOqOvMFLSsgmZJiaX3cwAt5UjnC1zfYR0LmnUjGNjTisHVq1HNef9Ghi4Q9Hna97fpRu/K6s8aBkeArry+6JkWuujnf8AktH0g5vtCnxI8yt4Ssv2slxayULu5q4f/wBG/wBVOlHmcOhVW2L9CZFXwv7mVjvouBU3RW4tbUPh4OwhSQKgKSv0K95lcwgY4pY2hznYbzYMbyLZHkXsL3v0ZoDqXQ8j3lzpA0XLuQLm7jE4tcXCxYDH1ZgjZbMB5lBK2Knja5rjFgxuddt8LCzkgA9d8+pAQm6uPGyocbSskbiaw3LRAC53Jzf8G/Mf5hvtQEug0bLA2QMe25baMOLy3EC8h789pxNBA6GDwAANP0TKWhl2C8U8b3FxeS6YhxfbCAc23IyHKIFgAgEptBPbJHKZbYHueWd2AHNlBAe8YySZBck54RssEBfIAQAgGamrjiF5JGsHW9waPOSlyUm9hR1mvGjIttWx31WKX+AELh1IrzLo4Wq/2lJWcKdG3KOGaTw2axvrdf1Ll1kXRwFR7bIyus3CFLWwOpxTtja4tucZe7kvDxbJo+KFXOppK1jXQwnhTU9LWjLqg+mCAEAIBC0dSEjscz29y9zfouI9im7OHCL2olRaYqm9zUzD/wBr/ZdTpy5nDw9J/tXoS4taq9uyqk/es7+IFT4kuZW8HQf7e/8AZMi160i3/HDvpMZ+QC68aRw8voPy+5Mi4Rq4bRC7exw9jlPjSOHltLyb/OhLi4Tqgd1Txnc5zfyKnx3yK3lkfKX2JcXCj8ukP7sl/a0Lrx1yK3lkvKRMj4T6b40Ew3YD/MFPjxK3ltXyaHpeEyiDbiOdx+S1rAfO54HrU+NE593Vr+XqVFZwrn/Bojvlk/lY0+1cusvJFqy5/ufoiirOEvSL74eLi6sERJ88hcPUufFkWxwNJbbso63Wium/aVkx8DXmMeVrLD1Llzk/MujQpR2RKlzsRxE3J2k5k7yuS5WWwLoSCAS6AnLguLHRmg6ipY58LAQ02N3AEm17C/TYjzrHiMdQw8lGo9v5rK51YwdmNaV0ZLTPDJQASMQsbgjZt3gqzDYqniI6VMmE1NXRDWg7BLAEAIAQCoAQkRCAQE2n0Y+QgNLcw4gnGO5DSfi3+MPBt6l0oNlMq8Y7TibR0jWuebWaXA558lzWnK3W9vnRxaJjWjJ2RzHo6RzC8YcLWlx5QOQBOwX6ip0WQ60U7CN0dITY2HJLjiNgMPdA9ThcXBzF81Giw60dp0NFyk4Ra9yOkbHiO+Y2XIz3qdFnLrxG5NFyA2LQThDrZHaSA3wvNjyRtsU0WSqsGQSxvUPMoO7IQxt6valyLI54seHzpcjRRLXJcaPRumXUTo2RsDmPYx7wSQXukaHXucm2uALDZtuc1izDL4YqKT1NbH+eRldPxLtvXd/Yb01I+eN082HjBIxoLcVgxwkOE52IBaM7X27brRh8NTw9LQgtn3FO0ZqK2WZ1FQ0mLBiu4GAEOL2XJcwPsCL2eCSD0Bwyba6wuvibXtZfFyfO19dtXn3Z05ztf6k2p0HAx8YLAQRI4tjMxLw1rTYC7iSL7Gm5uOgFZoY2s4yd+W22rrqtf5larSaZCk0bBG8YmXYGyGQh7rtwTysBvaxLsLWtG24zHSr44mrODs/iuktS13Sf22vy+ZYpya1bSo0hE1jmhoteKFx6c3RMc4+clb6E3JNvm16OxdBtrXzZGVx0CAVAIgBAaCOCQyNHGmxa7uBGcuQRews2972NwLbTdW2+ZgcoqL1dyAYXOxtMri5xsW2AB+HYASCeTdzybG2d+jbFi7SS12/LDc+OM4WyvIcx1w4EZXc3uXbLhot07lDuhGzV2h6SnIv8IScJuHNYQLAuLXX22LG52+OwhY1iZcvz8/kjVyB8LrvBqOS0tIuRhN3B5NjYNOLMW6du2669plZattxq5DccDrkcZhAe5nJawNsCLEWsNjnOPgBSWJkldLyv/r+A0uRTXWkuC6ECXQElQWk2GubZrZo8YbYNcw4JGgG4bisQ5vgcCR0EKb8yqVN63F7fQXSGk3SjAGhkYIOEZkkAgOe45uNieoZmwCN3EKSjrbuxs6UnsBxz7NwlovswkFtt1h5lnWGopt6K1/ztOtCPI4qa2WW3GPLrbL9C6p0KdPdVrhQitgy6QkNBOTRZvgFy6w8rifKrFFK7XmdLULJKXEFxJsA0X6mgADcAAFCilsC1CXUkggFQCIAUgtG+5XOHJsMHSbZ3aNrn2xWxdQsV38JkfjJdfzyG7U2EnDYk/LFmjjswGgknkWFxfub9KfCdXq3/ANfIj6S4jjDxPcYcr4xys/lXPV/UKJWvqJp6ej8W2/yJRNDytndC1uO2Xu617fFybf4175Lr4Sv/AJvy35/oac6jJs3IXFjJxuKxhscQZcZSi9wTcuOWEBPhH/L+W5/0c3oyWnkgXYXB3Hm4tJjbcf8AqF8s8R2ZJqIvUV/9fnMqMS5LgxITcS6EEwrkuEQCIBEAIBUAIBUB0hIKAIgBSQIUByUIOCpIZwShycFSQcocsRAKgBAf/9k=';
                    // newWorksheet['!images'] = [{
                    //     name: 'image1.jpg',
                    //     data: img,
                    //     opts: { base64: true },
                    //     position: {
                    //         type: 'twoCellAnchor',
                    //         attrs: { editAs: 'oneCell' },
                    //         from: { col: 4, row : 2 },
                    //         to: { col: 4, row: 2 }
                    //     }
                    // }]
                    // console.log(newWorksheet)

                    
                }
            }

            XLSX.utils.book_append_sheet(wb, newWorksheet, sheetName);// step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다. getSheetName 
            var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});// step 4. 엑셀 파일 만들기 
            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), saveFilename);// step 5. 엑셀 파일 내보내기 getExcelFileName

            function s2ab(s) { 
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;
            }
        }