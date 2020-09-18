class Cloner{
	constructor(dist){
    this.dist = dist;
    this.desc = "Auto-generated playlist copy";
		this.scroller = undefined;
		this.menuButns = undefined;
		this.lastSize = 0;
		this.timeSpent = 0;
    this.maxTime = 4;
    this.waitForBrowser = 1000;
		this.body = document.body;
    this.html = document.documentElement;
    this.elHeight = document.getElementsByTagName("ytmusic-responsive-list-item-renderer")[0].offsetHeight;
		this.scroller = setInterval(this.scrollDown.bind(this), 1000);
	}

	refreshMenuBtns(){
		this.menuButns = document.getElementsByClassName("dropdown-trigger style-scope ytmusic-menu-renderer");
		return this.menuButns.length;
	}

	scrollDown(){
		if(this.lastSize != this.refreshMenuBtns()){	
			var height = Math.max( this.body.scrollHeight, this.body.offsetHeight, 
				this.html.clientHeight, this.html.scrollHeight, this.html.offsetHeight );
			window.scrollTo(0, height);
            this.lastSize = this.refreshMenuBtns();
            this.timeSpent = 0;
		}else{
			this.timeSpent++;
			console.log("Waiting ... (" + this.timeSpent + ")");
			if(this.timeSpent >= this.maxTime){
				console.log("List has been loaded (extend maxTime or check your internet connection if it has not)");
                clearInterval(this.scroller);
                this.addSongs();
			}
		}
    }

    delay(delayInms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    }

    async addSongs(){
        window.scrollTo(0, 0);
        for(var btn = 1; btn < this.lastSize; btn++){
            await this.menuButns[btn].click();
            var menu = document.getElementsByClassName("yt-simple-endpoint style-scope ytmusic-menu-navigation-item-renderer");
            await menu[1].click();
            await this.delay(this.waitForBrowser);
            var options = document.getElementsByClassName("style-scope ytmusic-playlist-add-to-option-renderer");
            var found = false;
            for(var item = 0; item < options.length && !found; item++){
                var titles = options[item].getElementsByTagName("yt-formatted-string");
                for(var title = 0; title < titles.length && !found; title++){
                    if(titles[title].textContent == this.dist){
                        options[item].click();
                        found = true;
                    }
                }
            }

            //creates new playlist if there is not any with specified name
            if(!found){
              var field = document.getElementsByTagName("ytmusic-add-to-playlist-renderer")[0];
              var newPlaylistButton = field.getElementsByTagName("paper-button")[0];
              newPlaylistButton.click();
              await this.delay(this.waitForBrowser);
              var newPlaylistInput = document.getElementsByClassName("style-scope paper-input");
              for(var input = 0; input < newPlaylistInput.length; input++){
                if(newPlaylistInput[input].tagName == "INPUT" && newPlaylistInput[input].getAttribute("required") == "true"){
                  newPlaylistInput[input].value = this.dist;
                  //TODO: finish playlist creation
                }
              }
            }

            //scrolls by one item
            window.scrollBy(0, this.elHeight);
        }
    }
}

//var cl = new Cloner("New Playlist");