// Package name used in title display
const appTitle = 'Code Playground';

// Sections data
const sections = {
  about: {
    title: 'About this project',
    description: `
    <p>This is a simple template for documenting your JavaScript library, where it provides a live-ediitable code playground for users to test and play around.</p>
    <p>It is designed to be static website, so you don't need any fancy build tools or Node.js :)</p>
    `
  },
  quickStart: {
    title: 'Quick Start',
    description: `
    <p>
      To modify section contents, open <code class="bg-gray-800 p-0.5 rounded">src/data.js</code> and edit the <code class="bg-gray-800 p-0.5 rounded">section</code> variable.
    </p>
    `
  },
  techStack: {
    title: 'Technology Stack',
    description: `
    <p>Tailwind CSS and Alpine.js is used.</p>
    <ul class="mt-4 list-disc pl-4">
      <li>Tailwind CSS: <a href="https://tailwindcss.com/" target="_blank" class="text-blue-400">https://tailwindcss.com/</a></li>
      <li>Alpine.js: <a href="https://github.com/alpinejs/alpine" target="_blank" class="text-blue-400">https://github.com/alpinejs/alpine</a></li>
    </ul>
    `
  },
  simpleExample: {
    title: 'Simple Example',
    description: `
    <p>The below code block is editable. Press "Run" button to run the code.</p>
    <p>If you want to reset the code, simply press "Reset" button.</p>
    `,
    code: function simpleExample() {
      function curry(f) {
        return function(a) {
          return function(b) {
            return f(a, b);
          };
        };
      }

      function sum(a, b) {
        return a + b;
      }

      let curriedSum = curry(sum);

      alert(curriedSum(1)(2));
    }
  },
  consoleLogExample: {
    title: 'Using console.log()',
    description: `
    <p><code class="bg-gray-800 p-0.5 rounded">console.log()</code> is also suppoorted! The result can be find in the devtools of your browser.</p>
    <p>In case you are working on an environment which devtools isn't available, press the "Display Console Logs" button in the navigation pane.</p>
    `,
    code: function consoleLogExample() {
      var data = {
        name: 'John Doe',
        age: 13
      };
      console.log(data);
    }
  },
  sandbox: {
    title: 'Security',
    description: `
    <p>Codes are run using <code class="bg-gray-800 p-0.5 rounded">Function</code> constructor instead of using <code class="bg-gray-800 p-0.5 rounded">eval()</code> directly.</p>
    <p>This provides basic functionality to prevent accessing <code class="bg-gray-800 p-0.5 rounded">window</code> and <code class="bg-gray-800 p-0.5 rounded">document</code> object directly.</p>
    `,
    code: function sandboxExample() {
      alert('"window" object is not accessable: ' + JSON.stringify(window));
      alert('"document" object is not accessable: ' + JSON.stringify(document));
      alert('Using this to access global scope is protected, for example "this.document": ' + this.document);

      function namedFunc() {
        alert('Unfortunately in some scenerio, global scope is still accessable. For example "this.document": ' + this.document);
      }
      namedFunc();
    }
  }
};
