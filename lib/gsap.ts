'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { Flip } from 'gsap/Flip'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, Flip)
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, Flip }
