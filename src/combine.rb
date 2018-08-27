#!/usr/bin/ruby

#-------------------------------------------------------#
# A simple script to combine index.html, script.js, and #
# default.ccs into a single html source file.           #
#-------------------------------------------------------#

require 'yaml'

usage = "usage: combine.rb CoverLetter OutputName\n
 combine.rb expects three source files named index.html, default.css,
 and script.js in the current directory as well as a file path to a 
 cover letter and the output file name"

script_replace = '<script src="script.js"></script>'
style_replace = '<link rel="stylesheet" type="text/css" href="default.css">'
cover_replace = '<!-- INSERT COVER -->'

def getName()
    return '../build/' + ARGV[1] unless !ARGV[1].end_with?(".html")
    return '../build/' + ARGV[1] + '.html'
end

def formatCoverLetter(cover)
    date = DateTime.now
    cover_date = "<div id=\"cover-date\">#{date.strftime("%B %e, %Y")}</div>\n"
    cover_contact = "<div id=\"company-contact\">#{cover['contact']}</div>\n"
    greeting = "<div id=\"greeting\">#{cover['greeting']}</div>\n"
    content = "<div id=\"cover-content\">#{cover['content']}</div>\n"
    return cover_date + cover_contact + greeting + content
end

begin
    if(ARGV[1] == nil) then raise end
    script_content = IO.read('script.js')
    style_content = IO.read('default.css')
    html = IO.read('index.html')
    letter = YAML.load(File.open(ARGV[0]))
rescue Exception
    puts usage
    abort
end 

html[script_replace]= "<script>\n" + script_content + "</script>\n"
html[style_replace]= "<style>\n" + style_content + "</style>\n"
html[cover_replace]= formatCoverLetter(letter)

open(getName, 'w'){ |f|
    f.puts html
}
