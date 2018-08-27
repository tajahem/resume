# Travis McClellen's Resume

This is my resume. It features a responsive design, some simple unobtrusive animations, inline svg images, and dynamically built content that allows for different skills and achievements to be highlighted depending upon the focus of the resume. 

## Building

While the goal is to deliver everything in a single html file, working with everything in one giant text document is not terribly convenient. As such I've broken down the resume into four parts:

- the style sheet
- the script
- the html
- and a yaml file containing cover letter information

and use a simple ruby script called combine.rb to combine them all. The combine script requires the yaml file path and an output name. 

The yaml cover letter requires:

- contact
- greeting
- content

any of these can include html.