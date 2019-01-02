## Math power in your Markdown notes!
> Researching and comparing healthcare plans and pricing? Preparing for tax-season? Splitting expenses? Try this tool!

Ever need to do some quick calculations while taking notes? Spinning up a spreadsheet or coding environment feels like overkill, and their calculations don't easily plug back into your notes.

**Excelnotes lets you write quick in-line calculations using the `[=2+3]` syntax in your Markdown notes.** You can even use variables with `[=a=2]`, or perform unit conversions `[=5cm to in]`.
![](http://f.cl.ly/items/2N2M1h2p3o0y1f1A363l/Screen%20Shot%202019-01-02%20at%204.23.46%20PM.png)

### Principles
- **Marrying spreadsheets with Markdown**: spreadsheets are powerful, but can often be too much complexity for everyday use. The goal of excelnotes is to combine some of those powers with the simplicity of Markdown.
- **Own your data**: most modern productivity apps store your data on their servers in a proprietary format. Excelnotes lets you save your notes in plain-text wherever you want: Dropbox, iCloud, or your device. Don't get burned when the startup eventually shuts down or when the company sells or leaks your data!
- **Built on Markdown**: use all your favorite Github-Flavored Markdown syntaxes while leveraging the power of the `[=2+3]` calculation brackets. The calculations will only run in excelnotes, but you can take your data with you wherever you want.

### Installation
This tool is still in development and no executable is available, yet. You'll need to clone and build locally with node/n. 
```
git clone https://github.com/tarngerine/excelnotes.git
cd excelnotes
npm install
npm start
```
