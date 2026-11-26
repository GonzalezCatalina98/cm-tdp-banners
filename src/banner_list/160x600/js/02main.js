/* eslint-disable no-undef */

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
    self.tl.addLabel('frame1', '+=0.2')
      .to ( f1txt1, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame1')
      .to ( f1txt2, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame1')
      .to ( f1txt3, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame1')
      .add(function() {inishedAnimation();}, 'frame1')

    .addLabel('frame2', '+=0.2')
      .to([f1txt1, f1txt2, f1txt3], 1, { opacity: 0, ease: "power1.inOut"}, 'frame2')
      .to ( f2txt1, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame2+=0.5')
      .to ( f2txt2, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame2+=0.5')
      .to ( f2img, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame2+=0.5')
      .to ( f2txt3, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame2+=0.5')
      .add(function() {inishedAnimation();}, 'frame2')
   
    .addLabel('frame3', '+=0.2')
      .to([f2txt1, f2txt2, f2txt3, f2img], 1, { opacity: 0, ease: "power1.inOut"}, 'frame3')
      .to ( f3txt1, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame3+=0.5')
      .to ( f3txt2, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame3+=0.5')
      .to(f3img, 1, { opacity: 1, ease: "power1.inOut" }, "frame3+=0.5")
      .to(f3img, 3, { x: 300, ease: "power1.inOut" }, "frame3+=1.5")  
      .to ( f3txt3, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame3+=0.5')
      .to ( f3txt4, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame3+=0.5')
      .add(function() {inishedAnimation();}, 'frame3')

    .addLabel('frame4', '+=0.3')
      .to([f3txt1, f3txt2, f3txt3, f3txt4, , f3img], 1, { opacity: 0, ease: "power1.inOut"}, 'frame4')
      .to ( f4txt1, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame4+=0.5')
      .to ( f4txt2, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame4+=0.5')
      .to ( f4img, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame4+=0.5')
      .add(function() {inishedAnimation();}, 'frame4')

    .addLabel('frame5', '+=0.4')
      .to([f4txt1, f4txt2, f4img], 1, { opacity: 0, ease: "power1.inOut"}, 'frame5')
      .to ( f5txt1, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame5+=0.5')
      .to ( f5txt2, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame5+=0.5')
      .add(function() {inishedAnimation();}, 'frame5')

    .addLabel('frame6', '+=0.2')
      .to([f5txt1, f5txt2], 1, { opacity: 0, ease: "power1.inOut"}, 'frame6')
      .to ( f6txt1, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame6+=0.5')
      .to ( f6txt2, 2, { x: 0, opacity: 1, ease: "power1.inOut"}, 'frame6+=0.5')
      .add(function() {inishedAnimation();}, 'frame6')
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
