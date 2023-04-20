let menuBar = document.querySelector('.navbar .menuBar')
let menuBarActive = document.querySelector('.menuBarActive')
let closeBar = document.querySelector('.closeBar')

menuBar.addEventListener('click', () => {
    menuBarActive.classList.add('active')
})

closeBar.addEventListener('click', () => {
  menuBarActive.classList.remove('active')
})



