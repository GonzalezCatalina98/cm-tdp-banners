'use strict';

// Following is a SuperClass for your app
const LTApp = function() {
  this.INITED = false;
};

// Images preloading functions
LTApp.prototype = {
  preload: function(sources, callback) {
    this.sources = sources;
    let imgcount = 0;
    let img;
    $('*').each(function(i, el) {
      if (el.tagName !== 'SCRIPT' && el.tagName !== 'feMergeNode') {
        this.findImageInElement(el);
      }
    }.bind(this));
    if (this.sources.length === 0) {
      callback.call();
    } else if (document.images) {
      for (let i = 0; i < this.sources.length; i++) {
        img = new Image();
        img.onload = function() {
          imgcount++;
          if (imgcount === this.sources.length) {
            callback.call();
          }
        }.bind(this);
        img.src = this.sources[i];
      }
    } else {
      callback.call();
    }
  },
  determineUrl: function(element) {
    let url = '';
    let t;
    const style = element.currentStyle || window.getComputedStyle(element, null);

    if ((style.backgroundImage !== '' && style.backgroundImage !== 'none') ||
			(element.style.backgroundImage !== '' && element.style.backgroundImage !== 'none')) {
      t = (style.backgroundImage || element.style.backgroundImage);
      if (t.indexOf('gradient(') === -1) {
        url = t.split(',');
      }
    } else if (typeof(element.getAttribute('src')) !== 'undefined' && element.nodeName.toLowerCase() === 'img') {
      url = element.getAttribute('src');
    }
    return [].concat(url);
  },
  findImageInElement: function(element) {
    const urls = this.determineUrl(element);
    const extra = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/Opera/i)) ? '?rand=' + Math.random() : '';
    urls.forEach(function(url) {
      url = this.stripUrl(url);
      if (url !== '') {
        this.sources.push(url + extra);
      }
    }.bind(this));
  },
  stripUrl: function(url) {
    url = $.trim(url);
    url = url.replace(/url\("/g, '');
    url = url.replace(/url\(/g, '');
    url = url.replace(/"\)/g, '');
    url = url.replace(/\)/g, '');
    return url;
  },
};

/**
 *
 * Main Application
 *
 **/

function AppBanner() {
  if (AppBanner.instance !== undefined) {
    return AppBanner.instance;
  } else {
    // eslint-disable-next-line no-invalid-this
    AppBanner.instance = this;
  }
  // eslint-disable-next-line no-invalid-this
  LTApp.call(this);
  return AppBanner.instance;
}
AppBanner.prototype = new LTApp();
AppBanner.fn = AppBanner.prototype;

/**
 *
 * Singleton thing
 *
 **/
AppBanner.getInstance = function() {
  if (AppBanner.instance === undefined) {
    new AppBanner();
  }
  return AppBanner.instance;
};

/**
 *
 * Initialize your app, surcharge with whatever needed
 *
 **/
AppBanner.fn.init = function() {
  if (!this.INITED) {
    this.INITED = true;

    /**
		 * Add the images url you want to preload in the empty array on the first parameter
		 */
    this.preload([], this.display.bind(this));
  }
  iDsToVars();
};

/**
 *
 * shows everything, start animating
 *
 **/
AppBanner.fn.display = function() {
  $('body').removeClass('loading');
  $('body').addClass('loaded');
  AppBanner.fn.anima();
};

// SET IDS IN DOM TO GLOBAL VARIABLES
function iDsToVars() {
  const allElements = document.getElementsByTagName('id');

  for (let q = 0; q < allElements.length; q++) {
    const el = allElements[q];
    if (el.id) {
      window[el.id] = document.getElementById(el.id);
    }
  }
}

/**
 *
 * start animating
 *
 **/

/*
    Which platform these banners should be compliant with?
    (DCS or DCM)

    for DCM set isDCS to 'false';
*/

const isDCS = false;

const animation = {
  initVariables: function() {
    this.animationFinished = false;
    this.tl = new TimelineMax();
  },
  init: function() {
    const self = this;
    self.initVariables();

    // Assign timeline to window to be able to test.
    window.tl = self.tl;

    function finishedAnimation() {
      self.animationFinished = true;
      if (isi.config.enabled) {
        isi.startScroll();
      }
    }

    //
    // Timeline Animation
    //
    self.tl.addLabel('frame1', '+=0.5')
      .from(placeholder, { duration: 0.6, x: 500, ease: 'none' }, 'frame1')
      .to ( box, 2, { x: 300, repeat: -1, ease: "power2.inOut"}, 'frame1')
      .to ( box2, 0.2, { y: 300, repeat: -1, ease: "power2.in"}, 'frame1')
      .add(function() {
        finishedAnimation();
      }, 'frame1');
  },
};

const isi = {
  config: {
    enabled: true,
    scrollToTop: true,
    isiClone: false,
  },
  initVariables: function() {
    this.animationFinished = false;
    this.isiMain = $('.isi-main');
    this.scrollBar = $('.iScrollVerticalScrollbar');
    this.isiFinished = false;
    this.myScroll = null;
  },

  init: function() {
    const self = this;
    self.initVariables();

    if (self.config.isiClone) {
      // isi clone, NOTE: if you want to see a copy of the ISI next to the banner set the isiClone config to true
      $('#isi').clone().addClass('uat').attr('id', 'isi-clone').appendTo('body');
    }

    self.isiMain.mouseenter(function() {
      self.stopScroll();
    });

    self.isiMain.mouseleave(function() {
      if (animation.animationFinished) {
        if (!self.isiFinished) {
          self.startScroll();
        }
      }
    });

    self.initScrollBars();
  },

  initScrollBars: function() {
    const self = this;
    // Scroll init function. Keep disable options as they
    self.myScroll = new IScroll('.isi_wrapper', {
      scrollbars: 'custom',
      interactiveScrollbars: true,
      resizeScrollbars: false,
      mouseWheel: true,
      momentum: true,
      click: true,
      disablePointer: true,
      disableTouch: false,
      disableMouse: false,
    });

    self.myScroll.on('scrollStart', function() {
      if (animation.animationFinished) {
        if (self.myScroll.isAnimating) {
          self.stopScroll();
        }
      }
    });

    self.myScroll.on('scrollEnd', function() {
      if (!self.config.scrollToTop) return;
      if (myScroll.maxScrollY >= myScroll.y) {
        self.stopScroll();
        setTimeout(function() {
          self.myScroll.scrollTo(0, 0, 2000);
        }, 3000);
      }
    });

    window.myScroll = self.myScroll;

    self.scrollBar.mouseenter(function() {
      self.scrollSetUp();
    });
  },
  scrollSetUp: function() {
    this.myScroll.scrollBy(0, 0, 1, {
      fn: function(k) {
        return k;
      },
    });
  },
  startScroll: function() {
    const self = this;
    const initialScrollSpeed = 90000;
    const scrollWrapHeight = $('.isi_wrapper').outerHeight();
    const isiHeight = -1 * ($('.isi').outerHeight() - scrollWrapHeight);
    const scrolledPercentage = self.myScroll.y * 100 / isiHeight;
    const scrollSpeed = initialScrollSpeed - (initialScrollSpeed * (scrolledPercentage / 100));

    self.myScroll.refresh();
    setTimeout(function() {
      if (scrolledPercentage >= 100) {
        self.isiFinished = true;
      }
      self.myScroll.scrollTo(0, isiHeight, scrollSpeed, {
        fn: function(k) {
          return k;
        },
      });
    }, 300);
  },
  stopScroll: function() {
    self.myScroll.isAnimating = false; // stop animation
  },
};

/*
  For DCS
  This follows the following logic:

  AppBanner.fn.mainExitHandler = function(e) {
    e.preventDefault();
    Enabler.exit('clickTag1', 'www.google.com');
  };

  For DCM
  This follows the following logic:
  AppBanner.fn.mainExitHandler = function(e) {
    e.preventDefault();
    window.open(clickTag1);
  };

  const clickHandler = (label, url) => {
    if (label != undefined) {
      return (Enabler.exit(`${label}`, `${url}`));
    } else {
      window.open(url);
    }
  };
*/

AppBanner.fn.anima = function() {
  // Variables
  const mainExit = $('#mainExit');

  animation.init();

  if (isi.config.enabled) {
    isi.init();
  }
  // Exits Listeners
  mainExit.on('click', AppBanner.fn.mainExitHandler);
  $('#wrapper').on('click', AppBanner.fn.piExitHandler);
};


if (isDCS) {
  // Main Exit Handler
  AppBanner.fn.mainPanelHandler = function(e) {
    e.preventDefault();
    Enabler.exit('clickTag1', clickTag1);
  };

  // Pi Exit handler
  AppBanner.fn.piExitHandler = function(e) {
    e.preventDefault();
    Enabler.exit('clickTag2', clickTag2);
  };
} else {
  // Main Exit Handler
  AppBanner.fn.mainPanelHandler = function(e) {
    e.preventDefault();
    window.open(clickTag1);
  };

  // Pi Exit handler
  AppBanner.fn.piExitHandler = function(e) {
    e.preventDefault();
    window.open(clickTag2);
  };
}
