// Run with: node test-offers.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const elements = new Map();
const context = vm.createContext({
  console,
  document: {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, {
        addEventListener() {}, showModal() {}, innerHTML: ''
      });
      return elements.get(selector);
    },
    querySelectorAll: () => [],
    addEventListener() {}
  },
  IntersectionObserver: class { observe() {} }
});
vm.runInContext(fs.readFileSync(`${__dirname}/app.js`, 'utf8'), context);
const cards = elements.get('#offersGrid').innerHTML.split('<article').slice(1);
assert.equal(cards.length, 9);
const betcity = cards.find(card => card.includes('alt="БЕТСИТИ"'));
assert.ok(betcity.includes('href="https://r.dalead.pro/go-xe10d7d80df29e300?subid=ff"'));
assert.ok(!betcity.includes('data-get="betcity"'));
assert.ok(betcity.includes('data-offer="betcity"'));
assert.equal(cards.filter(card => card.includes('data-get=')).length, 8);
vm.runInContext('openOffer("betcity")', context);
assert.ok(!elements.get('#dialogContent').innerHTML.includes('ссылка пока не подключена'));
vm.runInContext('openOffer("fonbet")', context);
assert.ok(elements.get('#dialogContent').innerHTML.includes('ссылка пока не подключена'));
console.log('Offer links and dialogs: OK');
