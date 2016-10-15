import java.lang.Math;
import java.util.List;
import java.util.ArrayList;

public class MainClass {
  public static void main(String[] args)throws Exception {
  	new DFSClass().printOptions("{ Danas pada { kisa { i ulice su mokre } | snijeg { i ulice su { klizave | bijele |crne}}}. Sutra ce biti lijepo { vrijeme | setati }. }{Ovo je moj {primjer|zadatak}}");
  }
}

public class DFSClass {
  public void printOptions(String s)throws Exception{

	//prva zagrada
	int ind = s.indexOf('{');

	if (ind<0){ //nema zagrada
		System.out.println(s);
	}else{
		//naci odgovarajucu }
		int nestCount=0;
		int endIndex=ind;
		for (int i=ind+1;i<s.length();i++){
			if (s.charAt(i)=='{'){
				nestCount++;
			}else if (s.charAt(i)=='}'){
				if (nestCount==0){
					endIndex=i;
					break;
				}
				nestCount--;
			}
		}
		if (endIndex==ind){
			// nevalja format, nema }
			throw new Exception("invalid format");
		}

		// naci opcije u zagradi
		List<String> options = new ArrayList<String>();
		
        int startIndex=ind+1;
		
        nestCount=0;
		
        for (int i=startIndex; i<endIndex;i++){
			if (s.charAt(i)=='{'){
				nestCount++;
			}else if (s.charAt(i)=='}'){
				nestCount--;
			}else if (s.charAt(i)=='|'){
				if (nestCount==0){
					String option = s.substring(startIndex,i);
					options.add(option);
					startIndex = i+1;
				}
			}
		}
		
        if (startIndex<endIndex-1){ //zadnja opcija, ostatak prije }
			String option = s.substring(startIndex,endIndex);
			options.add(option);
		}

		String prefix = "";
		if (ind>0){
			prefix = s.substring(0,ind);
		}
		
        String sufix = "";
		if (endIndex<s.length()-1){
			sufix = s.substring(endIndex+1,s.length());
		}
		
        //rekurzija, isti string bez prve zagrade
		for (String option : options){
			printOptions(prefix+option+sufix);
		}
	}
}
}
