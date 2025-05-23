import blueMic from "../../../images/blueMic.png";
import yellowMic from "../../../images/yellowMic.png";
import portfolioBuilderIcon from "../../../images/portfolioBuilderIcon.png";
import cvBuilderIcon from "../../../images/cvBuilderIcon.png";
import textEditorIcon from "../../../images/textEditorIcon.png";
import articlesDirectoryIcon from "../../../images/articlesDirectoryIcon.png";

const micIconOptions = {
    blue: blueMic,
    yellow: yellowMic
};

const config = {
    tabs: [
        
        {
            id: 'nbl',
            theme: 'blue',
            heroImgSrc: textEditorIcon,
            cmdImgSrc: micIconOptions['blue'],
            title: 'Text Editor',
            desc: 'Write and format articles, blog posts, essays and much more; add images to your document; all this, using this Text Editor',
            cmd: 'Navigate Text Editor.',
            cmdSlice: 'Text Editor',
            navigateTo: '/TextEditor',
            //goTo: '/text-editor',
            cmdDesc: 'Navigates to the Text Editor Page',
        },
        {
            id: 'nbr',
            theme: 'yellow',
            heroImgSrc: articlesDirectoryIcon,
            cmdImgSrc: micIconOptions['yellow'],
            title: 'Articles Directory',
            desc: 'Publish your text documents directly onto our site and find all of them right here, in your personal Articles Directory',
            cmd: 'Navigate Articles Directory.',
            cmdSlice: 'Articles Directory',
            goTo: '/articles-directory',
            cmdDesc: 'Navigates to the Articles Directory Page',
        },

    ],
};

export default config;