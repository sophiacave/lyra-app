#!/usr/bin/env python3
import os
import subprocess
import argparse

def run_command(command):
    print(f"Running command: {command}")
    subprocess.run(command, shell=True, check=True)

def main():
    parser = argparse.ArgumentParser(description='Generate video from screenplay.')
    parser.add_argument('--screenplay', required=True, help='Path to the screenplay JSON file')
    args = parser.parse_args()

    screenplay_path = os.path.abspath(args.screenplay)

    run_command(f'python3 /Users/sophiacave/lyra-app/studio/graphics-engine.py {screenplay_path} --all')
    run_command('python3 /Users/sophiacave/lyra-app/studio/music-generator.py')
    run_command('python3 /Users/sophiacave/lyra-app/studio/narration-generator.py')
    run_command('python3 /Users/sophiacave/lyra-app/studio/composer.py')
    run_command('python3 /Users/sophiacave/lyra-app/studio/cinema-grade-effects.py')
    run_command('python3 /Users/sophiacave/lyra-app/studio/graphics-engine.py {screenplay_path} --all')
    run_command('python3 /Users/sophiacave/lyra-app/studio/music-generator.py')
    run_command('python3 /Users/sophiacave/lyra-app/studio/narration-generator.py')
    run_command('python3 /Users/sophiacave/lyra-app/studio/composer.py')
    run_command('python3 /Users/sophiacave/lyra-app/studio/cinema-grade-effects.py')
    from kling import interpolate_frames
    interpolate_frames('/path/to/start_frame.png', '/path/to/end_frame.png', '/output/video.mp4')
    run_command('ffmpeg -f concat -safe 0 -i /Users/sophiacave/lyra-app/concat_list.txt -c copy /Users/sophiacave/lyra-app/final_video.mp4')

if __name__ == '__main__':
    main()
