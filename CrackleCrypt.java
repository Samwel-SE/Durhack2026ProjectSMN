import java.io.File;
import java.io.IOException;
import javax.sound.sampled.*;

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

        System.out.println(obj.SongLength());

    }



    public void Encrypt(String input){
        //add the encryption code here
    }

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


