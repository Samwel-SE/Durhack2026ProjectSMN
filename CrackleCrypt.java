import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;
import java.util.Map;

public class CrackleCrypt {

    public String convertToBinary(String plaintext){
        StringBuilder sb = new StringBuilder();
        
        for (char c : plaintext.toCharArray()) {
            sb.append(String.format("%8s", Integer.toBinaryString(c)).replace(' ', '0'));
        }
        
        return sb.toString();
    }


    public static void main(String args[]){

    CrackleCrypt test = new CrackleCrypt();
        
        CrackleCrypt obj = new CrackleCrypt();

        System.out.println(obj.convertToBinary("alpha"));

        System.out.println(test.SongLength());

}



public void Encrypt(String input){}

public int SongLength(){
    File file= new File("Sound/Bee Gees - Stayin Alive (Official Music Video).wav");
    
    try (AudioInputStream inputStream = AudioSystem.getAudioInputStream(file)){
        AudioFormat format = inputStream.getFormat();
        long frames = inputStream.getFrameLength();
        double durationSec = frames / format.getFrameRate();

        return (int) Math.round(durationSec);
    } catch (UnsupportedAudioFileException | IOException x) {
        x.printStackTrace();
        return -1;
    }

}





}


