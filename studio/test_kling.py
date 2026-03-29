#!/usr/bin/env python3
import subprocess
from generate import generate_image_to_video

def main():
    start_frame_path = 'start_frame.png'
    end_frame_path = 'end_frame.png'
    output_video_path = 'output_video.mp4'
    
    # Create sample images if they don't exist
    subprocess.run(['ffmpeg', '-f', 'lavfi', '-i', 'color=c=black:s=1920x1080:d=1', '-c:v', 'libx264', start_frame_path], check=True)
    subprocess.run(['ffmpeg', '-f', 'lavfi', '-i', 'color=c=white:s=1920x1080:d=1', '-c:v', 'libx264', end_frame_path], check=True)
    
    generate_image_to_video(start_frame_path, end_frame_path, output_video_path)
    print(f'Video generated: {output_video_path}')

if __name__ == '__main__':
    main()
