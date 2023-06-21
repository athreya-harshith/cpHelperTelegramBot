const { Telegraf } = require('telegraf');
const axios = require('axios');
var sha512 = require('js-sha512');
require('dotenv').config()


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(`WELCOME I am a bot for algorithms\n1.use / to give command\n2.use /commands to check for the available algorithms`));

let ss = `// SELECTION SORT
        function selectionSort(arr)// this is default export
        {
            let min;
  
            //start passes.
            for (let i = 0; i < arr.length; i++) {
            //index of the smallest element to be the ith element.
            min = i;
  
             //Check through the rest of the array for a lesser element
            for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
  
        //compare the indexes
            if (min !== i) {
            //swap
                [arr[i], arr[min]] = [arr[min], arr[i]];
            }    
        }
  
    return arr;
  }
`;

let bs = `// C++ program to implement iterative Binary Search
#include <bits/stdc++.h>
using namespace std;

// A iterative binary search function. It returns
// location of x in given array arr[l..r] if present,
// otherwise -1
int binarySearch(int arr[], int l, int r, int x)
{
	while (l <= r) {
		int m = l + (r - l) / 2;

		// Check if x is present at mid
		if (arr[m] == x)
			return m;

		// If x greater, ignore left half
		if (arr[m] < x)
			l = m + 1;

		// If x is smaller, ignore right half
		else
			r = m - 1;
	}

	// if we reach here, then element was
	// not present
	return -1;
}

int main(void)
{
	int arr[] = { 2, 3, 4, 10, 40 };
	int x = 10;
	int n = sizeof(arr) / sizeof(arr[0]);
	int result = binarySearch(arr, 0, n - 1, x);
	(result == -1)
		? cout << "Element is not present in array"
		: cout << "Element is present at index " << result;
	return 0;
}
`;

let cmds = `THE AVAILABLE COMMANDS ARE\n1. /selectionSort\n2. /binarySearch\n3. /cppTemplate\n4. Use id:<codeforces-handle> to get the CF Handle
            `;
const regex = new RegExp('^id:.*');
try {
    bot.command('selectionSort', (ctx) => ctx.reply(ss));
    bot.command('binarySearch',function fun(ctx)
    {
        return ctx.reply(bs);
    });
    bot.command('commands',(ctx)=> ctx.reply(cmds));
    
    bot.command('cppTemplate',async (ctx)=>
    {
        console.log(ctx);
        let response = await axios.get('https://raw.githubusercontent.com/athreya-harshith/cp/main/template');
        ctx.reply(response.data);
        ctx.reply('still you can give command here');
        bot.command('againhere', (ctx) => ctx.reply('you got this again now we leave here'));
        
    } );

    // do from here 
    // https://codeforces.com/api/user.info?handles=DmitriyH;Fefer_Ivan
    bot.hears(regex,async (ctx)=>
    {
        let rand = Math.floor(100000 + Math.random() * 900000);
        let rstr = rand.toString();
        let time = Math.floor(Date.now()/1000);
        let t = time.toString();
        let tid = ctx.update.message.text;
        let id = tid.slice(3,tid.length);
        let hstr = `${rstr}/user.info?apiKey=${process.env.CF_KEY}&handles=${id}&time=${t}#${process.env.CF_SECRET}`
        let hash = sha512.update(hstr);
        let url = `https://codeforces.com/api/user.info?handles=${id}&apiKey=${process.env.CF_KEY}&time=${t}&apiSig=${rstr}${hash.hex()}`;
        let check = false;
        try
        {
            var response = await axios.get(url);
        }
        catch(error)
        {
            // console.log('caught error',error);
            check =true;
            ctx.reply(error.response.data.comment);
        }
        // console.log(response.data); 
        /* 
        contribution: 0,
      lastOnlineTimeSeconds: 1681039864,
      rating: 1292,
      friendOfCount: 6,
      titlePhoto: 'https://userpic.codeforces.org/2128521/title/cbb3cfd9de128fd3.jpg',
      rank: 'pupil',
      handle: 'Ajith_S',
      maxRating: 1292,
      avatar: 'https://userpic.codeforces.org/2128521/avatar/692007797658c67e.jpg',
      registrationTimeSeconds: 1626679223,
      maxRank: 'pupil'

      https://codeforces.com/profile/athreya_harshith
 */ 
        if(!check && response.data.status == "OK")
        {
            console.log(response.data);
            let pic = response.data.result[0].titlePhoto;
            let handle = response.data.result[0].handle;
            let rating = response.data.result[0].rating;
            let rank = response.data.result[0].rank;
            let maxrank = response.data.result[0].maxRank;
            let maxrating = response.data.result[0].maxRating;
            let friendcount = response.data.result[0].friendOfCount;
            let plink = `https://codeforces.com/profile/${handle}`
            let cap =`Handle : ${handle}\nRating : ${rating.toString()}\nRank : ${rank}\nMaxRating : ${maxrating.toString()}\nMaxRank : ${maxrank}\nFriend Count : ${friendcount.toString()}\nVisit Profile : \n${plink}`;
            ctx.replyWithPhoto({url:pic},{caption:cap});
        }
        // console.log(rand,time);
        // console.log(rstr,t);
    });

    bot.on('sticker', (ctx) => ctx.reply('👀'));
    bot.on('emoji', (ctx) => ctx.reply('👀'));
    bot.on('text', (ctx) => ctx.reply('Sorry no text\'s are  indentified here please enter only commands'));
   
    
    bot.launch();

} catch (error) {
    console.log('some error caught');
}