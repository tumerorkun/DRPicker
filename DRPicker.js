// IIFE
  !(function(){
    //constructor
    this.DRPicker = function(){
      this.o = {
        crt :function(tt){
          el = new this.cd;
          el.t = document.createElement(tt);
          return el;
        },
        jcrt :function(tt){
          el = new this.cd;
          el.t = document.createElement(tt);
          return el.t;
        },
        sel:function(tt){
          el = new this.cd;
          el.t = document.querySelector(tt);
          return el;
        },
        cd:function(){
          this.e = null;
          this.attr = function(a,b){
            this.t.setAttribute(a,b);
            return this;
          };
          this.apn = function(tt,i){
            if(typeof tt == 'object' && tt.length > 1){
              var dis = this;
              tt.forEach(function(a){
                if(typeof a == 'string'){
                  a = document.createElement(a);
                }
                dis.t.appendChild(a);
              })
            }
            else if(i === undefined || (typeof tt != 'string' && i === 1)){
              if(typeof tt == 'string'){
                tt = document.createElement(tt);
              }
              this.t.appendChild(tt);
            }
            else if(typeof tt == 'string' && i === 1){
              this.t.innerHTML = tt;
            }
            return this;
          };
          this.on = function(a,b){
            this.t.addEventListener(a,b);
            return this;
          };
          this.end = function(){
            return this.t;
          };
          this.put = function(pt){
            pt.appendChild(this.t);
            return this;
          };
        }
      }
      //global vars
      this.today = new Date(),
      this.startSelected = [0],
      this.endSelected   = [0],
      this.mainDiv       = null;
      //options
      var defaults = {
        elementId: null,
        prevImg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAAUklEQVR42u3VMQoAIBADQf8Pgj+OD9hG2CtONJB2ymQkKe0HbwAP0xucDiQWARITIDEBEnMgMQ8S8+AqBIl6kKgHiXqQqAeJepBo/z38J/U0uAHlaBkBl9I4GwAAAABJRU5ErkJggg==',
        nextImg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAAU0lEQVR42u3VOwoAMAgE0dwfAnNjU26bYkBCFGwfiL9VVWoO+BJ4Gf3gtsEKKoFBNTCoCAYVwaAiGNQGMUHMkjGbgjk2mIONuXo0nC8XnCf1JXgArVIZAQh5TKYAAAAASUVORK5CYII=',
        months : ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
        weekdaysFull : ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
        weekdaysMin : ['Pz','Pzt','Sa','Çar','Per','Cu','Cmt'],
        weekdaysIndex : [0,1,2,3,4,5,6],
        firstDay: 0,
        firstTable: [this.today.getDate(),this.today.getMonth() + 1,this.today.getFullYear()],
        secondTable: [this.today.getDate(),this.today.getMonth() + 2,this.today.getFullYear()],
        seperator: '/',
        headersForTables:0,//['Başlangıç','Bitiş'],
        mode:1,//0 = tek tablo, 1 = iki bağımsız tablo, 2 = iki bağımlı tablo
        closeButton: false,
      }
      // ayarları oluştur varsa kullanıcı ayarlarını kullan
      this.options = defaults;
      if (arguments[0] && typeof arguments[0] === "object") {
        this.options = overWrite(defaults, arguments[0]);
      }
      init.call(this);
    }

    //public methods
    DRPicker.prototype.open = function(){
      this.mainDiv.style.display = 'block';
      var InputElemet = document.getElementById(this.options.elementId);
      var L = InputElemet.offsetLeft;
      var T = InputElemet.offsetTop + InputElemet.offsetHeight;
      this.mainDiv.style.transform = 'translate('+ L +'px,'+ T +'px)';
      this.mainDiv.style.marginRight = L*2+'px';
      
    }
    DRPicker.prototype.SDatePrevMonth = function(){
      if(this.options.mode == 2){this.EDatePrevMonth();}
      if(this.options.firstTable[1] == 1){
        this.options.firstTable[1] = 12;
        this.options.firstTable[2] = this.options.firstTable[2] - 1;
      }else{
        this.options.firstTable[1] = this.options.firstTable[1] - 1;
      }
      gunler.call(this,'first');
      preserveSelected.call(this);
      aksiyonEkle(this);
    }
    DRPicker.prototype.SDateNextMonth = function(){
      if(this.options.mode == 1){
        if((this.options.secondTable[1] - this.options.firstTable[1]) == 1 || Math.abs((this.options.secondTable[1] - this.options.firstTable[1])) == 11){this.EDateNextMonth();}
      }
      if(this.options.firstTable[1] == 12){
        this.options.firstTable[1] = 1;
        this.options.firstTable[2] = this.options.firstTable[2] + 1;
      }else{
        this.options.firstTable[1] = this.options.firstTable[1] + 1;
      }
      gunler.call(this,'first');
      preserveSelected.call(this);

      aksiyonEkle(this);
    }
    DRPicker.prototype.EDatePrevMonth = function(){
      if(this.options.mode == 1){
        if((this.options.secondTable[1] - this.options.firstTable[1]) == 1 || Math.abs((this.options.secondTable[1] - this.options.firstTable[1])) == 11){this.SDatePrevMonth();}
      }
      if(this.options.secondTable[1] == 1){
        this.options.secondTable[1] = 12;
        this.options.secondTable[2] = this.options.secondTable[2] - 1;
      }else{
        this.options.secondTable[1] = this.options.secondTable[1] - 1;
      }
      gunler.call(this,'second');
      preserveSelected.call(this);
      aksiyonEkle(this);
    }
    DRPicker.prototype.EDateNextMonth = function(){
      if(this.options.mode == 2 ){this.SDateNextMonth();}
      if(this.options.secondTable[1] == 12){
        this.options.secondTable[1] = 1;
        this.options.secondTable[2] = this.options.secondTable[2] + 1;
      }else{
        this.options.secondTable[1] = this.options.secondTable[1] + 1;
      }
      gunler.call(this,'second');
      preserveSelected.call(this);
            aksiyonEkle(this)
    }
    DRPicker.prototype.close = function(){
      if(this.mainDiv.style.display == 'block'){
      this.mainDiv.style.display = 'none';}
    }
    DRPicker.prototype.WriteToInput = function(){
      var selected ={
        start: [
          this.startSelected[1].slice(-2),//start gün
          this.startSelected[1].slice(4,-2),//start ay
          this.startSelected[1].slice(0,4) //start yıl
        ]};
        if(this.endSelected[1]){
          selected.end = [
            this.endSelected[1].slice(-2),//end gün
            this.endSelected[1].slice(4,-2),//end ay
            this.endSelected[1].slice(0,4) //end yıl
          ];
        }
      document.getElementById(this.options.elementId).value =(this.endSelected[1])? 
        selected.start[0]
        + this.options.seperator +
        selected.start[1]
        + this.options.seperator +
        selected.start[2]
        + ' - ' +
        selected.end[0]
        + this.options.seperator +
        selected.end[1]
        + this.options.seperator +
        selected.end[2] :
        selected.start[0]
        + this.options.seperator +
        selected.start[1]
        + this.options.seperator +
        selected.start[2];
    }

    //private methods
    function init(){
      var wMS = this.options.weekdaysMin,
          wIS = this.options.weekdaysIndex,
          fD  = this.options.firstDay;
      if(fD != 0){
        for (fD ; fD != 0; fD--) {
          wMS.push(wMS.shift());
          wIS.push(wIS.shift());
        }
      }
      this.mainDiv = this.o.crt('div')
                      .attr('id','DRPicker')
                      .attr('style','position:absolute;display:none').put(document.body).t;
      if(this.options.headersForTables != 0 && typeof this.options.headersForTables == 'object'){
        var headersForTables = this.o.crt('div')
                                .attr("<table class='headersForTables'><tbody><tr><td>"
                                        +this.options.headersForTables[0]+
                                        "</td><td>"
                                        +this.options.headersForTables[1]+
                                        "</td></tr></tbody></table>",1)
                                .put('#DRPicker').t;
      }
      makeTable.call(this,wMS,'first');
      gunler.call(this,'first');
      if(this.options.mode != 0){
        makeTable.call(this,wMS,'second');
        gunler.call(this,'second');
      }
      if (this.options.closeButton) {
        this.o.crt('div').attr('id','DRPickerClose').apn('Close',1).put(this.mainDiv).end();
      }
      initEvents.call(this);
    }
    function initEvents(){
      var dis = this;
      var kapat = true;
      document.getElementById(this.options.elementId).addEventListener('click',this.open.bind(this));
      document.getElementById('firstprevMonth').addEventListener('click',this.SDatePrevMonth.bind(this));
      if(this.options.mode != 2){document.getElementById('firstnextMonth').addEventListener('click',this.SDateNextMonth.bind(this));}
      if (document.getElementById('DRPickerClose')) {
        document.getElementById('DRPickerClose').addEventListener('click',this.close.bind(this),true);
      }
      this.mainDiv.addEventListener('mouseover',function(){
        kapat = false;
      });
      this.mainDiv.addEventListener('mouseout',function(){
        kapat = true;
      });
      document.body.addEventListener('click',function(){
        kapat && dis.close.call(dis)
      },true);
      aksiyonEkle(this)
      if(this.options.mode != 0){
        if(this.options.mode != 2){document.getElementById('secondprevMonth').addEventListener('click',this.EDatePrevMonth.bind(this));}
        document.getElementById('secondnextMonth').addEventListener('click',this.EDateNextMonth.bind(this));
      }
    }
    function makeTable(){
      var prevMonth,nextMonth,monthyearTD,trH,tr,te,ty;
      var tableDiv = this.o.crt('div').attr('id',arguments[1]+'TableDiv').attr('class','TableDiv').apn(
            te  = this.o.crt('table').attr('style','border-collapse:collapse;width:230px;').attr('id',arguments[1]+'Table').apn([
              th  = this.o.crt('thead').apn([
                trH = this.o.crt('tr').apn([
                  prevMonth = this.o.crt('th').attr('id',arguments[1]+'prevMonth').attr('align','left')
                              .apn(
                                  (!(this.options.mode == 2 && arguments[1] == 'second')) ?
                                    this.o.crt('img').attr('src',this.options.prevImg).attr('class','arrow').t :
                                    '',1
                              ).t,
                  monthyearTD = this.o.crt('th').attr('id',arguments[1]+'monthyear').attr('align','center').attr('colspan','5')
                                .apn([this.o.crt('span').attr('id',arguments[1]+'month').t,
                                      this.o.crt('span').apn(' - ',1).t,
                                      this.o.crt('span').attr('id',arguments[1]+'year').t
                                ]).t,
                  nextMonth = this.o.crt('th').attr('id',arguments[1]+'nextMonth').attr('align','right')
                              .apn(
                                (!(this.options.mode == 2 && arguments[1] == 'first')) ? 
                                  this.o.crt('img').attr('src',this.options.nextImg).attr('class','arrow').t :
                                  '',1
                              ).t,
                ]).t,//ay yıl ve ileri geri butonları
                tr  = this.o.crt('tr').t//günler içine yazılacak firstday sırasına göre
              ]).t,//thead
              ty = this.o.crt('tbody').t
            ]).t//table
          ).put(this.mainDiv);
      //günleri döngüde yazdır
      for (var i = 0; i < arguments[0].length; i++) {
        this.o.crt('th').attr('align','center').attr('width','50').apn(arguments[0][i],1).put(tr);
      }
    }
    function gunler(){
      var ay,yil,ilkGün,
          d = new Date(),
          hangi;
      if(arguments[0]){hangi = arguments[0]}
        this.o.sel('#'+hangi+'Table').t.children[1].innerHTML = '';
        ay  = this.options[hangi+'Table'][1] - 1;
        yil = this.options[hangi+'Table'][2];
        var monthsDays = this.options.months.map((m,i)=>{ return new Date(yil,i+1,0,12).getDate(); }),//ay kaç çekiyor onu al
            monthsFDay = monthsDays.map((f,i)=>{ return new Date(yil,i,1,12).getDay(); }),//ayın ilk günü ne (pz,pzt,sa,çrş vs)
            daysNumber = monthsDays[ay];//ayın gün sayısını bozmamak için kopyasını al (immutable)
        this.o.sel('#'+hangi+'month').t.innerHTML = this.options.months[ay];
        this.o.sel('#'+hangi+'year').t.innerHTML = yil;
        for(var i=0;i<7;i++){if(monthsFDay[ay] == this.options.weekdaysIndex[i]){ilkGün=i;}}
        var td=[],div=[],gun;
        while(daysNumber > 0 ){
          var trDays = this.o.crt('tr').t;
          for (var i = 0; i < 7; i++) {
            div[i] = this.o.crt('div');
            td[i] = this.o.crt('td').attr('align','center').apn(div[i].t);
            var dataDateAy = ((ay+1) <= 9)?'0'+(ay+1):(ay+1);
            if(i == ilkGün){
              ilkGün = (ilkGün == 6)?0:i + 1;
              gun = monthsDays[ay] - (--daysNumber);
              div[i].attr('class','dateNumber '+hangi+'number').apn(''+gun,1);
              td[i].attr('class','numberTd '+hangi+'numberTd');
              var dataDateGun = (parseInt(gun) <= 9)?'0'+parseInt(gun):parseInt(gun);
              td[i].attr("data-date", ''+yil+dataDateAy+dataDateGun);
            }else{td[i].innerHTML = ''}
            td[i].put(trDays);
            if(gun == d.getDate().toString() && ay == d.getMonth() && yil == d.getFullYear()){div[i].t.classList.add('today')}
            if(daysNumber == 0){break;}
          }
          this.o.sel('#'+hangi+'Table').t.children[1].appendChild(trDays);
        }
    }
    function aksiyonEkle(dis){
      document.querySelectorAll('.dateNumber').forEach(function(el){//hangi dediğimiz first mı second mi
        el.onclick = function(){eylem()};
        el.onmouseover = function(){sinif(1)};
        el.ontouchstart = function(){sinif(1)};
        el.onmouseleave = function(){sinif(0)};
        el.ontouchend = function(){sinif(0)};
        function sinif(a){
          if(a == 1 ){
            el.classList.add('hovering');
            if (dis.endSelected[0] === 0) {
              isRange(dis,el.parentNode.getAttribute('data-date'));
            }
      
          }else{el.classList.remove('hovering')}
        }
        function eylem(){
          var close = false;
          var yeniDate = el.parentNode.getAttribute('data-date');
          if(dis.startSelected[0] === 0 && dis.endSelected[0] === 0){//hiç seçim yoksa
            dis.startSelected[0] = 1;dis.startSelected[1] = yeniDate;
            el.className += ' clicked sclicked onlysclicked';
          }
          else if(dis.startSelected[0] === 1 && dis.endSelected[0] === 0){//bir seçim varsa
            if (yeniDate > dis.startSelected[1]) {
              dis.endSelected[0] = 1;dis.endSelected[1] = yeniDate;
              el.className += ' clicked eclicked';
            }
            else {
              dis.endSelected[0] = 1;
              dis.endSelected[1] = dis.startSelected[1];
              dis.startSelected[1] = yeniDate;
              document.querySelectorAll('.sclicked').forEach(function(l){l.classList.remove('sclicked');l.classList.add('eclicked')});
              el.className += ' clicked sclicked';
            }
            document.querySelector('.onlysclicked').classList.remove('onlysclicked');
            close = true;
          }
          else{//iki seçim de varsa
            if(yeniDate < dis.startSelected[1]){//yeni tıklanan ilk seçimden önceki bir tarihse  
              document.querySelectorAll('.sclicked').forEach(function(l){l.classList.remove('clicked');l.classList.remove('sclicked');});
              el.className += ' clicked sclicked';
              dis.startSelected[1] = yeniDate;
            }
            else if(yeniDate > dis.endSelected[1]){//yeni tıklanan son seçimden sonraki bir tarihse  
              document.querySelectorAll('.eclicked').forEach(function(l){l.classList.remove('clicked');l.classList.remove('eclicked');});
              el.className += ' clicked eclicked';
              dis.endSelected[1] = yeniDate;
            }
            else{//yeni seçim önceki seçilen iki tarihin arasında kalıyorsa
              console.log('hangi aralığı seçmek istiyorsun?');
              clearSelection(dis);
              return false;
            }
            close = true;
          }
          isRange(dis);
          dis.WriteToInput();
          // close && dis.close.call(dis);
        }
      });
    }
    function preserveSelected(){
      var dis = this;
      document.querySelectorAll('[data-date]').forEach(function(el){
        if(el.getAttribute('data-date') == dis.startSelected[1]){
          el.children[0].classList.add('clicked');el.children[0].classList.add('sclicked');
        }
        if(el.getAttribute('data-date') == dis.endSelected[1]){
          el.children[0].classList.add('clicked');el.children[0].classList.add('eclicked');
        }
        if(el.getAttribute('data-date') == dis.startSelected[1] && dis.endSelected[0] == 0 && dis.startSelected[0] == 1){
          el.children[0].classList.add('onlysclicked');
        }
        isRange(dis);
      });
    }

    function clearSelection(dis){
      document.querySelectorAll('.sclicked').forEach(function(l){l.classList.remove('clicked');l.classList.remove('sclicked');});
      document.querySelectorAll('.eclicked').forEach(function(l){l.classList.remove('clicked');l.classList.remove('eclicked');});
      document.querySelectorAll('.inRange').forEach(function(l){l.classList.remove('inRange');});
      dis.startSelected = [0];
      dis.endSelected = [0];
    }

    function isRange(dis,hoverDate){
      document.querySelectorAll('.inRange').forEach(function(l){l.classList.remove('inRange')});
      if (typeof hoverDate != 'undefined') {
        document.querySelectorAll('#DRPicker table td').forEach(function(td){
          var date = td.getAttribute('data-date');
          if( (date > dis.startSelected[1] && date < hoverDate ) || (date < dis.startSelected[1] && date > hoverDate ) ){
            td.classList.add('inRange');
          }
        });
      } else {
        document.querySelectorAll('#DRPicker table td').forEach(function(td){
          var date = td.getAttribute('data-date');
          if(date > dis.startSelected[1] && date < dis.endSelected[1]){
            td.classList.add('inRange');
          }
        });
      }
    }
    // Alet Çantası
    function overWrite(source, properties) {
      var property;
      for (property in properties) {
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
    }

}());

