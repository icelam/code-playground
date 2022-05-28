window.onload = function () {
  var aplineJsScript = document.createElement('script');
  aplineJsScript.src = 'https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js';
  aplineJsScript.setAttribute('type', 'module');
  document.body.appendChild(aplineJsScript);

  var aplineJsScriptIe11 = document.createElement('script');
  aplineJsScriptIe11.src = 'https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine-ie11.min.js';
  aplineJsScriptIe11.setAttribute('nomodule', 'true');
  aplineJsScriptIe11.setAttribute('defer', 'true');
  document.body.appendChild(aplineJsScriptIe11);
};

// convert title to slug
function convertToSlug(str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// prettify codes
function pretty(code) {
  return js_beautify(code, { indent_size: 2, brace_style: 'preserve-inline' });
}

// get codes
function getCode(codeSnippet) {
  var code = pretty(codeSnippet.toString());
  // take out the function wrapper
  code = code
    .split('\n')
    .slice(1).slice(0, -1)
    .map(function trim(s) { return s.trim(); })
    .join('\n');
  code = pretty(code);
  return code;
}

// Create sandbox for eval code in a safer way
// Reference: https://stackoverflow.com/a/12554727
function createSandbox(code) {
  // create window and document with limited functionality
  var locals = {
    window: {
      // Put any global variables you want the code runner to be able to access here
      // Example:
      // jwtToken: window.jwtToken,
    },
    document: {}
  };

  // simulate this context
  var that = Object.create(null);
  // Names of local variables
  var params = [];
  // Local variables
  var args = [];

  for (var param in locals) {
    // eslint-disable-next-line no-prototype-builtins
    if (locals.hasOwnProperty(param)) {
      args.push(locals[param]);
      params.push(param);
    }
  }

  // create the parameter list for the sandbox
  var context = Array.prototype.concat.call(that, params, code);

  // create the sandbox function
  var sandbox = new (Function.prototype.bind.apply(Function, context));

  // create the argument list for the sandbox
  context = Array.prototype.concat.call(that, args);

  // bind the local variables to the sandbox
  return Function.prototype.bind.apply(sandbox, context);
}

// AlpineJs x-data for <body>
function app() {
  return {
    // Is navigation pane opened
    isNavigationOpen: false,

    // Is console output div showing
    isShowingConsole: false,

    // Console output element
    consoleOutputDiv: undefined,

    // Append a div on screen to show the console output
    // or remove the div element when it is already there
    toggleConsoleOutput: function (container) {
      var consoleOutputDivId = 'console-output';

      // Actual code to calculate the height after resize
      var mousePosition;
      var resizeConsoleOutput = function (event) {
        var dy = mousePosition - event.y;
        mousePosition = event.y;
        var newHeight = (parseInt(getComputedStyle(this.consoleOutputDiv, '').height, 10) + dy);
        var maxHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.9;
        this.consoleOutputDiv.style.height = `${
          newHeight < 56
            ? 56
            : newHeight > maxHeight
              ? maxHeight
              : newHeight
        }px`;
      }.bind(this);

      // Create and insert the console output div on screen
      // Attach listeners required for resize together
      if (!this.isShowingConsole) {
        this.consoleOutputDiv = document.createElement('div');
        this.consoleOutputDiv.setAttribute(
          'class',
          'sticky bottom-0 left-0 bg-gray-900 z-40 w-full h-14 shadow-inner pt-2 pb-1 px-1'
        );
        this.consoleOutputDiv.setAttribute('id', consoleOutputDivId);

        var consoleOutputUl = document.createElement('ul');
        consoleOutputUl.setAttribute(
          'class',
          'overflow-y-auto h-full'
        );
        this.consoleOutputDiv.appendChild(consoleOutputUl);
        container.appendChild(this.consoleOutputDiv);

        ConsoleLogHTML.DEFAULTS.log = 'text-white text-xs break-all';
        ConsoleLogHTML.DEFAULTS.debug = 'text-white text-xs break-all';
        ConsoleLogHTML.DEFAULTS.error = 'text-red-500 text-xs break-all';
        ConsoleLogHTML.DEFAULTS.warn = 'text-yellow-500 text-xs break-all';
        ConsoleLogHTML.DEFAULTS.info = 'text-blue-500 text-xs break-all';
        ConsoleLogHTML.connect(consoleOutputUl);
        console.log('Showing console output on webpage.');

        this.consoleOutputDiv.addEventListener('mousedown', function (event) {
          mousePosition = event.y;
          document.addEventListener('mousemove', resizeConsoleOutput, false);
        }, false);

        // Prevent dragging from children
        // We only want it to be draggable by the handle bar
        consoleOutputUl.addEventListener('mousedown', e => e.stopPropagation());

        document.addEventListener('mouseup', function () {
          document.removeEventListener('mousemove', resizeConsoleOutput, false);
          document.removeEventListener('touchmove', resizeConsoleOutput, false);
        }, false);

        this.isShowingConsole = true;
        return;
      }

      // Clean up console output div if it is already showing
      document.removeEventListener('mouseup', resizeConsoleOutput, false);
      this.consoleOutputDiv.removeEventListener('mousedown', resizeConsoleOutput, false);
      this.consoleOutputDiv.remove();
      this.consoleOutputDiv = undefined;
      this.isShowingConsole = false;
    }
  };
}

// AlpineJs x-data for each section block
function sectionBlock(codeName) {
  return {
    codeName,
    editor: undefined,
    initCodeEditor: function (element) {
      var editorDiv = element.querySelector('.editor');
      this.editor = ace.edit(editorDiv);
      this.editor.session.setMode();
      this.editor.session.setValue(getCode(sections[codeName].code));
      this.editor.setOptions({
        theme: 'ace/theme/dracula',
        mode: 'ace/mode/javascript',
        keyboardHandler: 'ace/keyboard/vscode',
        maxLines: 20,
        showPrintMargin: false,
        tabSize: 2,
        useSoftTabs: true
      });
    },

    // Run code block
    runCode: function () {
      try {
        var sandbox = createSandbox(this.editor.getValue());
        sandbox();
      } catch (error) {
        console.error(error);
      }
    },

    // Reset code to initial state
    resetCode: function () {
      this.editor.session.setValue(getCode(sections[codeName].code));
    }
  };
}
