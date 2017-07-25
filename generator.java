// What we need to generate
		boolean html = false;
		boolean css = true;
		
		// HTML
		if(html) {
			System.out.println("\t\t\t<!-- START GENERATED CODE -->");
			for(int h = 0; h < 100; h++) {
				System.out.println("\t\t\t<li><div></div><div></div></li>");
			}
			System.out.println("\t\t\t<!-- END GENERATED CODE -->");
		}
		
		// CSS
		if(css) {
			System.out.println("/* GENERATED CODE BELOW THIS LINE */");
			String animationName = "flip";
			String backAnimationName = "backflip";
			for(int i = 1; i < 101; i++) {
				// Background position
				System.out.println("#container li:nth-child("+ i +") div { background-position:0 -"+ (i-1) * 5 +"px; }");
				
				// "Flip"
				System.out.println("#container:hover li:nth-child("+ i +") div { -webkit-animation-name: "+ animationName + i +"; }");
				
				System.out.println("@-webkit-keyframes "+ animationName + i + " {");
				for(int j = 0; j < 100; j++) {
					if(j < i) {
						System.out.print(" " + j + "% { }");
					}
				}
				System.out.println(" 100% { -webkit-transform: rotateY(180deg); }");
				System.out.println("}");
				
				// "Backflip"
				System.out.println("#container li:nth-child("+ i +") div { -webkit-animation-name: "+ backAnimationName + i +"; }");
				
				System.out.println("@-webkit-keyframes "+ backAnimationName + i + " {");
				for(int k = 0; k < 100; k++) {
					if(k < i) {
						System.out.print(" " + k + "% { -webkit-transform: rotateY(180deg); }");
					}
				}
				System.out.println(" 100% { -webkit-transform: rotateY(0deg); }");
				System.out.println("}");
			}
		}