#!/usr/bin/ruby

#-------------------------------------------------------#
# A simple script to combine index.html, script.js, and #
# default.ccs into a single html source file.           #
#-------------------------------------------------------#

usage = "usage: combine.rb OutputName\n
 combine.rb expects three source files named index.html, default.css,
 and script.js in the current directory as well as the output file name"

script_replace = '<script src="script.js"></script>'
style_replace = '<link rel="stylesheet" type="text/css" href="default.css">'

def getName()
    return '../build/' + ARGV[0] unless !ARGV[0].end_with?(".html")
    return '../build/' + ARGV[0] + '.html'
end
 
begin
    if(ARGV[0] == nil) then raise end
    script_content = IO.read('script.js')
    style_content = IO.read('default.css')
    html = IO.read('index.html')
rescue Exception
    puts usage
    abort
end 

html[script_replace]= "<script>\n" + script_content + "</script>\n"
html[style_replace]= "<style>\n" + style_content + "</style>\n"
    
open(getName, 'w'){ |f|
    f.puts html
}
