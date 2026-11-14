 // import javax.sound.sampled.*;


public class CrackleCrypt {

    public String convertToBinary(String plaintext){
        StringBuilder sb = new StringBuilder();
        
        for (char c : plaintext.toCharArray()) {
            sb.append(String.format("%8s", Integer.toBinaryString(c)).replace(' ', '0'));
        }
        
        return sb.toString();
    }


    public static void main(String args[]){
        
        CrackleCrypt obj = new CrackleCrypt();

        System.out.println(obj.convertToBinary("alpha"));

    }

}


