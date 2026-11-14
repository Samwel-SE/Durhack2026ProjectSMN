import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;
import java.util.Map;

public class CrackleCrypt {

public static void main(String args[]){

    CrackleCrypt test = new CrackleCrypt();

    System.out.println("hello");

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


