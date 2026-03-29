#!/usr/bin/env python3
import os
import subprocess
import argparse
from kling import interpolate_frames

def run_command(command):
    print(f"Running command: {command}")
    subprocess.run(command, shell=True, check=True)

def main():
    parser = argparse.ArgumentParser(description='Generate video from screenplay.')
    parser.add_argument('--phase', required=True, help='Phase to execute (e.g., interpolate)')
    parser.add_argument('--start_frame', help='Path to the start frame image')
    parser.add_argument('--end_frame', help='Path to the end frame image')
    args = parser.parse_args()

    if args.phase == 'upscale':
        upscale(args.input_path, args.output_path)
    elif args.phase == 'interpolate':
        interpolate_frames(args.start_frame, args.end_frame)
    else:
        screenplay_path = os.path.abspath(args.screenplay)
        run_command(f'python3 /Users/sophiacave/lyra-app/studio/graphics-engine.py {screenplay_path} --all')
        run_command('python3 /Users/sophiacave/lyra-app/studio/music-generator.py')
        run_command('python3 /Users/sophiacave/lyra-app/studio/narration-generator.py')
        run_command('python3 /Users/sophiacave/lyra-app/studio/composer.py')
        run_command('python3 /Users/sophiacave/lyra-app/studio/cinema-grade-effects.py')
        run_command(f'ffmpeg -f concat -safe 0 -i /Users/sophiacave/lyra-app/concat_list.txt -c copy /Users/sophiacave/lyra-app/final_video.mp4')

if __name__ == '__main__':
    main()
