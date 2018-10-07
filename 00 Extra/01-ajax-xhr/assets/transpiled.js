'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// const apiCredentials = [
// {key: 'unsplash'},
// {key: 'nytimes'},
// ]

function setTimeValueBy() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'one-day';

  return { '1-minute': 60, '10-minutes': 60 * 10, 'one-hour': 60 * 60, 'one-day': 60 * 60 * 24 }[time];
}

function getCookieExpiredTime(time) {
  var now = new Date();
  now.setTime(now.getTime() + 1 * setTimeValueBy(time) * 1000);
  return now.toGMTString();
}

function getCookieWith(key) {
  var cookies = document.cookie.split(';');
  return cookies.find(function (cookie) {
    return cookie.includes(key);
  }).trim();
}

function extactContentOf(cookie) {
  var _cookie$split = cookie.split('\='),
      _cookie$split2 = _slicedToArray(_cookie$split, 2),
      key = _cookie$split2[0],
      value = _cookie$split2[1];

  return { key: key, value: value };
}

function setDefaultCookieValueIn(inputTarget) {
  var key = inputTarget.dataset.target;
  var input = getElementBy('[data-input="' + key + '"]');
  var targetCookie = extactContentOf(getCookieWith(key));

  if (targetCookie) input.value = targetCookie.value;
}

function setCookieValueFrom(inputTarget) {
  return function () {
    var key = inputTarget.dataset.target;
    var input = getElementBy('[data-input="' + key + '"]');
    var accessKey = input.value;

    document.cookie = key + '=' + accessKey + ';expires=' + getCookieExpiredTime("one-day") + ';';
  };
}

function applyEventToStoreCookieFrom(inputTarget) {
  inputTarget.addEventListener('click', setCookieValueFrom(inputTarget));
}

function handleCookieEventsIn(inputTargets) {
  inputTargets.forEach(function (input) {
    setDefaultCookieValueIn(input);
    applyEventToStoreCookieFrom(input);
  });
}

function getElementBy(targetReference) {
  return document.querySelector(targetReference);
}

function getEachElementsWith(targetsReference) {
  return Array.from(document.querySelectorAll(targetsReference));
}

function getAccessKeyOf(apiName) {
  return {
    'unsplash': handleStorageOfAccessKey('unsplash'),
    'nytimes': handleStorageOfAccessKey('nytimes')
  }[apiName];
}

function handleStorageOfAccessKey(apiName) {
  return extactContentOf(getCookieWith(apiName)).value || getElementBy('[data-input="' + apiName + '"]').value;
}

var searchButton = getElementBy('[data-event="search-submit"]');
// console.log(searchButton);

function showResponse(event) {
  console.log(event);
  console.log(this);
}

function openRequest(text) {
  var requestUnsplash = new XMLHttpRequest();
  requestUnsplash.open('GET', 'https://api.unsplash.com/search/photos?page=1&query=' + text);
  requestUnsplash.onload = showResponse;
  var accessKey = getAccessKeyOf('unsplash');
  requestUnsplash.setRequestHeader('Authorization', 'Client-ID ' + accessKey);
  requestUnsplash.send();
}

searchButton.addEventListener('click', function (event) {
  var textToSearch = getElementBy('[data-input="search-text"]').value.trim();
  console.log(textToSearch);
  if (textToSearch) openRequest(textToSearch);
});

document.addEventListener('DOMContentLoaded', function () {
  var inputTargets = getEachElementsWith('[data-event="set-keys"]');

  handleCookieEventsIn(inputTargets);
});
