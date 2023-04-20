
let roomOne = document.querySelector('.rooms .box-container .roomOne')

roomOne.addEventListener('click', () => {
  roomOneDynamicGallery.openGallery(0);
});

const roomOneDynamicGallery = lightGallery(roomOne, {
  dynamic: true,
  dynamicEl: [
      {
        src: 'images/rooms/Room 1/Room 1.jpg',
      },
      {
        src: 'images/rooms/Room 1/SGT-14.jpg',
      },
      {
        src: 'images/rooms/Room 1/SGT-16.jpg',
      },
      {
        src: 'images/rooms/Room 1/SGT-17.jpg',
      },
      {
        src: 'images/rooms/Room 1/SGT-19.jpg',
      },
      {
        src: 'images/rooms/Room 1/SGT-20.jpg',
      }
  ],
})


let roomTwo = document.querySelector('.rooms .box-container .roomTwo')

roomTwo.addEventListener('click', () => {
  roomTwoDynamicGallery.openGallery(0);
});


const roomTwoDynamicGallery = lightGallery(roomTwo, {
  dynamic: true,
  dynamicEl: [
      {
        src: '../images/rooms/Room 2/Room 2.jpg',
      },
      {
        src: '../images/rooms/Room 2/SGT-02.jpg',
      },
      {
        src: '../images/rooms/Room 2/SGT-03.jpg',
      },
      {
        src: '../images/rooms/Room 2/SGT-26.jpg',
      }
  ],
})


let senior = document.querySelector('.rooms .box-container .senior')

senior.addEventListener('click', () => {
  seniorDynamicGallery.openGallery(0);
});


const seniorDynamicGallery = lightGallery(senior, {
  dynamic: true,
  thumbnail: true,
  dynamicEl: [
      {
        src: 'images/rooms/Senior/Senior.jpg',
      },
      {
        src: 'images/rooms/Senior/SGT-21.jpg',
      },
      {
        src: 'images/rooms/Senior/SGT-22.jpg',
      },
      {
        src: 'images/rooms/Senior/SGT-23.jpg',
      }
  ],
})


let family = document.querySelector('.rooms .box-container .family')

family.addEventListener('click', () => {
  familyDynamicGallery.openGallery(0);
});


const familyDynamicGallery = lightGallery(family, {
  dynamic: true,
  thumbnail: true,
  dynamicEl: [
      {
        src: 'images/rooms/Family/Family.jpg',
      },
      {
        src: 'images/rooms/Family/SGT-28.jpg',
      },
      {
        src: 'images/rooms/Family/SGT-29.jpg',
      },
      {
        src: 'images/rooms/Family/SGT-30.jpg',
      },
      {
        src: 'images/rooms/Family/SGT-31.jpg',
      }
  ],
})







