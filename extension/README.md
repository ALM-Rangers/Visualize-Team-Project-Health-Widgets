# TPHealth VSTS Extension

## Build

*Important note* Make sure that you have Typescript 2.3.4 installed on your system:

    npm install --global typescript@2.3.4

as the extension is not yet compatible with later version of Typescript.

To compile the code base:

    npm install
    tsc -p .

To create the `vsix` archive:

    grunt exec:package
 