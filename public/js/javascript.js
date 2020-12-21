
	
	document.addEventListener('DOMContentLoaded', function(){
		
		GetClock();
		setInterval(GetClock, 1000);

	
	}, false );
	
	
	/* TIME */

	var tmonth = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	var tdate = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

	function GetClock() {
		var d = new Date();
		var nmonth = d.getMonth();
		var nday = d.getDay();
		var ndate = d.getDate();
		var nyear = d.getYear();
		if(nyear<1000) nyear+=1900;
		var nhour = d.getHours();
		var nmin = d.getMinutes();
		if(nmin<=9) nmin = "0" + nmin

		document.getElementById('clockbox').innerHTML = nhour + ":" + nmin ;
		document.getElementById('datebox').innerHTML = tdate[nday] + "-" + ndate + "-" + tmonth[nmonth];
	}
	
	
	
	/* QUICK SEARCH */

		
	
	/* INPUT SEARCH */
	
	var input = document.getElementById("input1");
	var help= document.getElementById('help');
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("myBtn").click();
  }
});

function Nostros()
{
	var vt = document.getElementById("input1").value;

	switch(vt){
		case '': help.innerHTML="Maybe try Start ??"
		break;
		case '?' : help.innerHTML="START: to start the chat app"
		break;
		case 'START' : location.replace("login.html")
		break;
		case 'jay' : window.open('img/jay.png','_blank','titlebar=no,toolbar=no,menubar=no,scrollbars=no,height=800,width=900');
		break;
		default:
			help.innerHTML="Enter ? for help"
		
	

	}
}