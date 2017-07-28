function zhuanyi(str){
    while(str.indexOf("\b")==-1){
        str = str.slice(str.indexOf("\b")-1,3);
    }
    console.log(str);
}
zhuanyi("abc\b\bd\b\bghi");
