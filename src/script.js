let state;
let xpWriter;
let skillWriter;
let controls;
let themeManager;

/* The state class holds current state information necessary for swapping between
 * the previous and current states. */
class State {
    constructor() {
        this.query = window.matchMedia('(min-width: 1024px)');
        /* 
            focus determines what skills and experience achievements are shown 
            s = generalist focus, d = developer, t = IT, g = graphic design
            related: 
                matchesFocus(flags) 
                XpWriter.xp.job.highlights.flags
                SkillWriter.skillList.category.skills.skill.flags   
        */
        this.focus = 's';
        this.page = 'cover';
        this.previousPage = 'resume';
        this.query.addListener(function (){ themeManager.changeTheming(); });
    }

    get isDesktop() {
        return this.query.matches;
    }

    swapPages() {
        let tmp = this.previousPage;
        this.previousPage = this.page;
        this.page = tmp;
    }

    matchesFocus(flags) {
        return this.focus === 'a' || flags.includes(this.focus);
    }
}//end State

class ThemeManager{
    constructor(){
        this.changeTheming();
    }

    changeTheming() {

        if(state.isDesktop) {
            document.getElementById("notice").style.visibility = "visible";
            setTimeout(removeNotice, 5000);
            removeFolding();
        } else {
            document.getElementById("notice").style.visibility = "hidden";
            addFolding();
        }
        setMouseEvents();

        function removeNotice(){
            let notice = document.getElementById('notice');
            notice.style.animation = "removeRight 1s";
            notice.style.visibility = "hidden";
        }

        function addFolding() {
            let sections = document.getElementsByClassName('section');

            for (let i = 0; i < sections.length; i++) {
                let id = "section-" + i;
                assignIds(id, sections[i]);          
                sections[i].getElementsByClassName('section-content')[0].style.display = "none";  
                sections[i].getElementsByClassName('section-title')[0].onclick =
                    function () {
                        openSection(id);
                        sections[i].scrollIntoView();
                    }
            }
        
            function assignIds(id, section){
                section.getElementsByClassName('triangle-right')[0].id = id + '-flair';
                section.getElementsByClassName('section-content')[0].id = id;
            }

            function openSection(id) {
                let content = document.getElementById(id);
                let aniName = 'flip-90';
                if (content.style.display === "none") {
                    resetSectionExpansion(false);
                    content.style.display = "block";
                    rotateId(id + "-flair", '90');
                    content.style.animation = "expand-controls 4s"
                } else {
                    content.style.display = "none";
                    rotateId(id + "-flair", '0');
                    aniName = 'reverse-' + aniName;
                }
                document.getElementById(id + "-flair").style.animation = aniName + " 1s";
            }
        
        
        }

        function resetSectionExpansion(open) {
            let sections = document.querySelectorAll('.section-content');
            sections.forEach(function (s) {
                s.style.display = (open) ? 'block' : 'none';
            });
            let flairs = document.querySelectorAll('.section-flair');
            flairs.forEach(function (f){ 
                let t = f.getElementsByClassName('triangle-right')[0];
                t.style.animation = 'reverse-flip-90 1s';
                rotate(t, '0'); 
            });
        }

        function removeFolding(){
            let sections = document.getElementsByClassName('section');
            for (let i = 0; i < sections.length; i++) {
                sections[i].getElementsByClassName('section-content')[0].style.display = "block";  
                sections[i].getElementsByClassName('section-title')[0].onclick =
                    function () {};
            }
        }

        function setMouseEvents() {
            let controlsElement = document.getElementById("controls");
            if (state.isDesktop) {
                controlsElement.onmouseenter = function () { controls.open(); };
                controlsElement.onmouseleave = function () { controls.close(); };
            } else {
                controlsElement.onmouseenter = function () { }
                controlsElement.onmouseleave = function () { }
            }
        }
    }

}//end ThemeManager

class XpWriter {
    constructor() {
        this.xp = [
            {
                title: 'Technology and E-Communications',
                company: 'Guiding Star Girl Scout Council',
                dates: '2004-2008',
                highlights: [
                    {
                        text: 'Handled general IT and Tech Support for local and remote locations',
                        flags: 'dtgs'
                    },
                    {
                        text: 'Wrote, designed, and edited the quarterly BEAMS newsletter',
                        flags: 'gs'
                    },
                    {
                        text: 'Hand coded and designed the council website',
                        flags: 'dtgs'
                    },
                    {
                        text: 'Rebuilt and repurposed old computers',
                        flags: 'dts'
                    },
                    {
                        text: 'Created an inventory database including monthly reporting using MS Access',
                        flags: 'dts'
                    }
                ]
            },
            {
                title: 'Office Clerk II',
                company: 'Nebraska Game and Parks Commission',
                dates: '2010-2013',
                highlights: [
                    {
                        text: 'Answered in person and over the phone questions regarding the Lake McConaughy and Lake Ogallala SRAs',
                        flags: 'dts'
                    },
                    {
                        text: 'Assisted visitors in registering for camping, fishing, and hunting licenses',
                        flags: 'dts'
                    },
                    {
                        text: 'Created Excel based tools to assist with campground processing',
                        flags: 'dts'
                    },
                    {
                        text: 'Created new campground maps',
                        flags: 'gs'
                    }
                ]
            },
            {
                title: 'Attendant',
                company: 'FCA Cenex',
                dates: '2013-2015',
                highlights: [
                    {
                        text: 'Learned Java programming in between helping customers and moping floors',
                        flags: 'dts'
                    }
                ]
            },
            {
                title: 'Solo Indie Game Developer',
                company: '',
                dates: '2015-present',
                highlights: [
                    {
                        text: 'Created numerous prototypes in different game engines',
                        flags: 'dtgs'
                    },
                    {
                        text: 'Created 2d sprites and animations',
                        flags: 'gs'
                    },
                    {
                        text: 'Created simple music',
                        flags: 'gs'
                    },
                    {
                        text: 'Created a Ruby on Rails server to handle simple leaderboards',
                        flags: 'dts'
                    },
                    {
                        text: 'Created and Edited a number of narration tracks',
                        flags: 'gs'
                    }
                ]
            }
        ];
    }

    write() {
        let xpSection = getContentSection('xp');

        //clear before we write or things keep adding
        xpSection.innerHTML = "";

        this.xp.forEach(function (job) {
            let jobDiv = createDiv({ name: 'job' });
            createHeader(jobDiv);
            createAchievements(jobDiv, job);
            xpSection.appendChild(jobDiv);

            function createHeader(parent) {
                let header = createDiv({ name: 'job-header' });
                header.appendChild(createDiv({ name: 'job-title', text: job.title }));
                header.appendChild(createDiv({ name: 'company', text: job.company }));
                header.appendChild(createDiv({ name: 'job-dates', text: job.dates }));
                parent.appendChild(header);
            }

            function createAchievements(parent, job) {
                let achievements = createDiv({ name: 'achievements' });
                job.highlights.forEach(function (h) {
                    if (state.matchesFocus(h.flags)) {
                        achievements.appendChild(createDiv({
                            name: 'achievement', text: h.text
                        }));
                    }
                });
                parent.appendChild(achievements);
            }

        });
    }
}// end XpWriter

class SkillWriter {
    constructor() {
        this.skillList = [
            {
                category: 'Technical',
                skills:
                [
                    { 
                        name: 'Web Development',
                        mastery: 50,
                        comment: 'HTML, CSS and Javascript',
                        flags: 'gs'
                    },
                    {
                        name: 'Java',
                        mastery: 75,
                        comment: 'Some experience with Android and libGDX',
                        flags: 'ds'
                    },
                    {
                        name: 'Javascript',
                        mastery: 25,
                        comment: 'Check out the source for this resume for an example',
                        flags: 'd'
                    },
                    {
                        name: 'Ruby',
                        mastery: 25,
                        comment: 'Some Ruby on Rails experience',
                        flags: 'd'
                    },
                    {
                        name: 'SQL',
                        mastery: 25,
                        comment: 'Not much practical experience beyond MySQL challenges on HackerRank',
                        flags: 'dt'
                    },
                    {
                        name: 'PC Building/Repair',
                        mastery: 75,
                        comment: '',
                        flags: 'dtgs'
                    },
                    {
                        name: 'Basic Networking',
                        mastery: 50,
                        comment: '',
                        flags: 'dts'
                    },
                    {
                        name: 'Security',
                        mastery: 50,
                        comment: 'The Security Now podcast is part of my weekly routine',
                        flags: 'dts'
                    },
                    {
                        name: 'Linux',
                        mastery: 66,
                        comment: 'I have been a full time Linux user and Linux gamer since 2008',
                        flags: 'dtgs'
                    }
                ]
            },
            {
                category: 'Tools',
                skills:
                [
                    {
                        name: 'Terminal',
                        mastery: 50,
                        comment: '',
                        flags: 'dts'
                    },
                    {
                        name: 'Vim',
                        mastery: 50,
                        comment: ':wq',
                        flags: 'dt'
                    },
                    {
                        name: 'Git',
                        mastery: 25,
                        comment: '',
                        flags: 'dt'
                    },
                    {
                        name: 'Inkscape',
                        mastery: 75,
                        comment: 'see DeviantArt profile for example works',
                        flags: 'gs'
                    },
                    {
                        name: 'OpenToonz',
                        mastery: 25,
                        comment: '',
                        flags: 'g'
                    },
                    {
                        name: 'LMMS',
                        mastery: 50,
                        comment: '',
                        flags: 'gs'
                    },
                    {
                        name: 'Audacity',
                        mastery: 25,
                        comment: '',
                        flags: 'gs'
                    },
                    {
                        name: 'MS Office/LibreOffice',
                        mastery: 75,
                        comment: '',
                        flags: 'ts'
                    }
                ]
            },
            {
                category: 'Other',
                skills:
                [
                    {
                        name: 'Learning',
                        mastery: 100,
                        comment: '',
                        flags: 'dtgs'
                    },
                    {
                        name: 'Customer Service',
                        mastery: 75,
                        comment: '',
                        flags: 'dts'
                    },                    {
                        name: 'Writing',
                        mastery: 75,
                        comment: '',
                        flags: 'dtgs'
                    },
                    {
                        name: 'Graphic Design/Art',
                        mastery: 75,
                        comment: '',
                        flags: 'dts'
                    },
                    {
                        name: '2d Animation',
                        mastery: 25,
                        comment: '',
                        flags: 'gs'
                    },
                    {
                        name: 'Music Theory',
                        mastery: 25,
                        comment: '',
                        flags: 'gs'
                    }
                ]
            }
        ];
    }// end skillList

    write() {

        let section = getContentSection("skills");
        // clear before we write or everything just keeps adding
        section.innerHTML = "";

        this.skillList.forEach(function (category) {
            section.appendChild(createCategory(category.category, category.skills));
        });

        function createCategory(name, skills) {
            let category = createDiv({ 
                name: 'skill-category', 
                text: `<h4>${name}</h4>` 
            });
            skills.forEach(function (skill) {
                if (state.matchesFocus(skill.flags)) {
                    category.appendChild(createSkill(skill));
                }
            });
            return category;
        }

        function createSkill(skill) {
            let skillDiv = createDiv({ name: 'skill' });
            skillDiv.appendChild(createDiv({ name: 'skill-name', text: skill.name }));
            skillDiv.appendChild(createTooltip(skill));
            return skillDiv;
        }

        function createTooltip(skill) {
            let tooltip = createDiv({ name: 'tooltip' });
            tooltip.appendChild(createDiv({
                name: 'skill-mastery',
                text: getMasteryText(skill.mastery)
            }));
            tooltip.appendChild(createProgressBar(skill.mastery));
            if (skill.comment) {
                tooltip.appendChild(createDiv({ name: 'comment', text: skill.comment }));
            }
            return tooltip;
        }

        function getMasteryText(mastery) {
            if (mastery === 100) {
                return 'Master';
            } else if (mastery >= 75) {
                return 'Advanced';
            } else if (mastery >= 50) {
                return 'Intermediate';
            } else {
                return 'Beginner';
            }
        }

        function createProgressBar(progress) {
            let bg = createDiv({ name: 'progress-bar-bg' });
            let bar = createDiv({ name: "progress-bar" });
            bar.style.width = progress + '%';
            bg.appendChild(bar);
            return bg;
        }
    }
}// end Skill Writer

class Controls {
    constructor() {
        this.nextAnimation = 'flip';
        this.isOpen = false;
        document.getElementById("controls").style.display = "block";
        document.getElementById('expand-button').onclick = function () { controls.open(); };
        this.focusIds = {
            s: 'generalist',
            d: 'developer',
            t: 'it',
            g: 'designer',
            a: 'all'
        };
        this.markFocusButton();
    }

    open() {
        // to prevent collisions between mouseover/off events and other triggered events
        if(this.isOpen){ return; }

        document.getElementById('expand-button').onclick = function (){ controls.close(); };
        document.getElementById('expanded-controls').style.height = "auto";
        this.animateControls('expand', '56.25em');
        this.flipExpandButton();
        this.isOpen = true;
    }

    close() {
        // see similar notice in open ^^
        if(!this.isOpen){ return; }
        
        document.getElementById('expand-button').onclick = function () { controls.open(); };
        document.getElementById('expanded-controls').style.height = "0";
        this.animateControls('contract', (state.isDesktop) ? '2.5em' : '3em');
        this.flipExpandButton();
        
        this.isOpen = false;
    }

    animateControls(name, size) {
        let controlsElement = document.getElementById('controls');
        controlsElement.style.animation = name + "-controls 1s";
        controlsElement.style.maxHeight = size;
        if (state.isDesktop) { controlsElement.style.maxWidth = size; }
    }

    flipExpandButton() {
        document.getElementById('expand-icon').style.animation =
            this.nextAnimation + " 0.5s";
        
        this.nextAnimation = (this.nextAnimation === 'flip') ?
            'reverse-flip' : 'flip';
        
        rotateId('expand-icon', (this.nextAnimation === 'flip') ? '0' : '180');
    }

    markFocusButton() {
        let focusText = 'current-focus button';
        if(document.getElementsByClassName(focusText)[0]){
            document.getElementsByClassName(focusText)[0].className = 'button';
        }
        let focusButton = document.getElementById(this.focusIds[state.focus] + '-focus');
        focusButton.className = focusText;
    }

}// end Controls


function setupDocument() {
    state = new State();
    xpWriter = new XpWriter();
    skillWriter = new SkillWriter();
    controls = new Controls();
    themeManager = new ThemeManager();

    xpWriter.write();
    skillWriter.write();

    //hide resume
    let resume = document.getElementById("resume");
    resume.style.visibility = "hidden";
    resume.style.left = "-100%";
}

function changeFocus(f){
    if (state.focus !== f) {
        state.focus = f;
        xpWriter.write();
        skillWriter.write();
        controls.close();
        controls.markFocusButton();
    }
}

function swapPage() {
    swap(state.page, state.previousPage);
    state.swapPages();
    scrollToTop();
    controls.close();
    updateSwapButtonText();

    function swap(fromID, toID) {
        setAnimationAndPosition(fromID, "swap-out");
        setAnimationAndPosition(toID, "swap-in");
        document.getElementById(fromID).style.visibility = "hidden";
        document.getElementById(toID).style.visibility = "visible";
    }

    function setAnimationAndPosition(id, animation) {
        let element = document.getElementById(id);
        element.style.animation = animation + " 1s";
        let visibleLocation = (state.isDesktop) ? '2.5%' : '0';
        element.style.left = (animation === 'swap-in') ? visibleLocation : "-100%";
    }

    function updateSwapButtonText(){
        let button = document.getElementById('swap-page-button');
        button.innerHTML = 'Show ' + capitalize(state.previousPage);
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
}

// HELPERS \\

// used by xp and skill writers to get the writeable section
function getContentSection(id) {
    return document.getElementById(id).getElementsByClassName('section-content')[0];
}

// simplified method to create a div with optional class, id, and text
function createDiv(opt) {
    let div = document.createElement('div');
    if (opt.name) { div.className = opt.name; }
    if (opt.id) { div.id = opt.id; }
    if (opt.text) { div.innerHTML = opt.text; }
    return div;
}

// create a header of the specified type (h1, h2, etc)
function createHxElement(type, text) {
    let header = document.createElement('h' + type);
    header.innerHTML = text;
    return header;
}

// fetches the specified id rotates it via rotate below
function rotateId(id, degrees) {
    let element = document.getElementById(id);
    rotate(element, degrees);
}

// sets the transform: rotate(degrees) of an element 
// call to make the end result of an animation stick
function rotate(element, degrees){
    let rotation = "rotate(" + degrees + "deg)";
    element.style.webkitTransform = rotation;
    element.style.MozTransform = rotation;
    element.style.msTransform = rotation;
    element.style.OTransform = rotation;
    element.style.transform = rotation;
}

// no muss no fuss string first letter capitalization
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}