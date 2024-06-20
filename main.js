const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY='kudosv3'

const playlist = $('.playlist')
const heading=$('header h2')
const cdThumb=$('.cd-thumb')
const audio=$("#audio")
const playBtn=$('.btn-toggle-play')
const player=$('.player')
const progress=$('#progress')
const nextBtn=$('.btn-next')
const prevBtn=$('.btn-prev')
const randomBtn=$('.btn-random')
const repeatBtn=$('.btn-repeat')
const songslist =[
    {
        name: 'Có em',
        singer:'Madihu,LowG',
        path:'./assets/music/song1.mp3',
        image:'./assets/img/song1.jpg'
    },
    {
        name: 'OK',
        singer:'Binz',
        path:'./assets/music/song2.mp3',
        image:'./assets/img/song2.jpg'
    },
    {
        name: 'Vẫn nhớ',
        singer:'SOOBIN',
        path:'./assets/music/song3.mp3',
        image:'./assets/img/song3.jpg'
    },
    {
        name: 'Muốn được cùng em',
        singer:'Freaky',
        path:'./assets/music/song4.mp3',
        image:'./assets/img/song4.jpg'
    },
    {
        name: 'Tình đắng như ly cà phê',
        singer:' Nân, Ngơ',
        path:'./assets/music/song5.mp3',
        image:'./assets/img/song5.jpg'
    },
    {
        name: 'Như Anh Đã Thấy Em',
        singer:'PhucXP,Freak D',
        path:'./assets/music/song6.mp3',
        image:'./assets/img/song6.jpg'
    },
    {
        name: '3107',
        singer:'W/N, DuongG, Nâu',
        path:'./assets/music/song7.mp3',
        image:'./assets/img/song7.jpg'
    },
    {
        name: '3107-2',
        singer:'W/N, DuongG, Nâu',
        path:'./assets/music/song8.mp3',
        image:'./assets/img/song8.jpg'
    },
    {
        name: '3107-3',
        singer:'W/N, DuongG, Nâu',
        path:'./assets/music/song9.mp3',
        image:'./assets/img/song9.jpg'
    },
    {
        name: 'Anh Đã Từ Bỏ Rồi Đấy',
        singer:' Nguyenn x @aric1407',
        path:'./assets/music/song10.mp3',
        image:'./assets/img/song10.jpg'
    }
]

const app={
 
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    songs:songslist,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    setConfig: function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render:function(){
        const htmls=this.songs.map((song,index)=>{
            return `
        <div class="song ${index===this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
         </div>`
        })
        playlist.innerHTML=htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents:function(){
        const _this=this
        const cd=$('.cd')
        const cdWidth=cd.offsetWidth

        const cdThumbAnimate=cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],  {
                duration:10000,
                iterations:Infinity
            }

        )
        cdThumbAnimate.pause()

        document.onscroll=function(){
            const scrollTop=window.scrollY
            const newCdWidth= cdWidth - scrollTop

            cd.style.width=newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity=newCdWidth/cdWidth
        }


        playBtn.onclick=function(){
            if(app.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
           
        }

        audio.onplay=function(){
            app.isPlaying=true
            player.classList.add('playing')
            cdThumbAnimate.play()

        }
        audio.onpause=function(){
            app.isPlaying=false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }


        audio.ontimeupdate=function(){
            if(audio.duration){
                const progressPercent=Math.floor(audio.currentTime/audio.duration *100)
                progress.value=progressPercent
            }
        }

        progress.onchange=function(e){
            const seekTime=e.target.value*audio.duration/100
            audio.currentTime=seekTime
        }

        nextBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }
            else{
                _this.nextSong()
            }
            audio.play()    
            _this.render()
            _this.scrollToActiveSong()
        }

        prevBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }
            else{
                _this.prevSong()
            }           
             audio.play()
             _this.render()
             _this.scrollToActiveSong()

        }

        randomBtn.onclick=function(e){
            _this.isRandom= !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }



        audio.onended=function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click();
            }
        }


        repeatBtn.onclick=function(e){
            _this.isRepeat=!_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)

            repeatBtn.classList.toggle('active',_this.isRepeat)
        }


        playlist.onclick=function(e){

            const songNode=e.target.closest('.song:not(.active)')

            if(songNode||e.target.closest('.option'))
            {

                if(songNode){
                    _this.currentIndex=Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    
                }

                if(e.target.closest('.option'))
                {

                }
                
            }
        }
    },
    scrollToActiveSong:function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'end',
            })
        }, 300)
    },
    loadCurrentSong:function(){
        
        heading.textContent=this.currentSong.name;
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
        audio.src=this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom=this.config.isRandom
        this.isRepeat=this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex>=this.songs.length-1){
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex<0){
            this.currentIndex=this.songs.length-1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex=Math.floor(Math.random() *this.songs.length)
        }while(newIndex===this.currentIndex)
        this.currentIndex=newIndex
        this.loadCurrentSong()
    },
    start:function(){
        this.loadConfig()

        this.defineProperties()

        this.handleEvents()

        this.loadCurrentSong()

        this.render()

        randomBtn.classList.toggle('active', this.isRandom)

        repeatBtn.classList.toggle('active',this.isRepeat)
    }
}
app.start()