export const kindWordsTestimonials = [
  {
    paragraphs: [
      "I've had the privilege of having AJ as my mentor throughout my time at DigitalOcean, starting back when I was just an intern. Her extensive knowledge of our design system and product experience means I can ask her anything and get good guidance.",
      "AJ stands out in her ability to think at multiple levels at once. She doesn't just design, she strategizes. She naturally considers business goals, technical constraints, and user needs together.",
      "She also pushed me, consistently and generously, to stand up for the user experience even when it was the harder path. That kind of mentorship is rare, and it's shaped how I approach my work every day. I'm really lucky to continue working with her.",
    ],
    attribution: "Isabel S, associate product designer",
  },
  {
    paragraphs: [
      "AJ has demonstrated exceptional skill and dedication as a senior designer at DigitalOcean. Her contributions across various projects have significantly impacted the company's growth and customer satisfaction. AJ's ability to blend research, customer journey understanding, and technical insight has been invaluable. On concurrent priorities, she helped ensure that key features moved toward launch despite shifting product direction.",
    ],
    attribution: "John H, senior product design manager",
  },
  {
    paragraphs: [
      "AJ was an exceptional partner on the launches of Custom Roles, SSO, and Session Management work for DigitalOcean's cloud platform. The team had to pivot directions multiple times, and each time AJ has stepped in and effectively \"saved the day\" with thoughtful, well-structured solutions.",
      "Her designs are consistently customer-centric, balancing technical rigor with what will create the best possible user experience. I especially appreciate AJ's ability to recommend clear priorities, highlighting which enhancements will drive the most value and where we can responsibly cut scope to deliver on time.",
      "Beyond the excellent quality of work, AJ brings a collaborative, positive energy that elevates the entire team. Her partnership has been invaluable, and I'd happily work with her again on any complex, high-impact initiative.",
    ],
    attribution: "Molly H, IAM senior product manager",
  },
  {
    paragraphs: [
      "I had the privilege to work closely with AJ Zichella on the IAM team at DigitalOcean, and she made a lasting impact on both the product and the team.",
      "AJ brings a rare combo of big-picture product thinking and attention to consistency across our entire UX. She isn't \"just\" a designer - she takes true ownership of the product, treating it as if it were her own. That mindset consistently showed up in the quality of her work and the clarity of direction she brought.",
      "What stood out most to me was how closely she partnered with engineering. AJ is deeply invested in making sure what we ship is not only polished, but genuinely useful for users. She asks the right questions, challenges assumptions, and keeps the team aligned on delivering real value.",
      "On top of that, she demonstrates strong leadership and accountability. She raised the bar for those around her and followed through on commitments in a way that built trust across the team.",
      "AJ was invaluable to our work on IAM, and any team would be lucky to have her. I can't recommend her enough.",
    ],
    attribution: "Michael C, senior software engineer II",
  },
  {
    paragraphs: [
      "AJ is the most impactful product designer at DigitalOcean.",
      "In the winter of 2024, our teams had just started to tackle the enormous task of adding support for role-based access control to DigitalOcean. Around the same time, new leadership came in, and informed us that our project was going to be the first done under a new accelerated timeline, bumping our schedule from about one year to one quarter. At the same time, we had some changes on the product side, leaving us with a quarter of the planned time and no product direction.",
      "While most of us sat back and prepared for the worst, AJ stepped up in a way I've never seen before and took on the absolutely enormous role of product owner and designer. She went back over the entire product, established a real vision and product direction, and worked with a ton of us across engineering to complete all of product design work to develop something we could ship in three months. If you Google, \"DigitalOcean custom scoped API tokens release date\", you can see that we hit our release timeline, shipping it on April 17, 2024. What could've been a death march ended up being completely fine.",
      "Rather than stop there, we were instead told that the next phase of the project would be under an accelerated timeline, again. This time was bigger though: instead of a number engineering teams collaborating to ship custom scoped API tokens, this time it was all of engineering coming together to ship role-based access control across every product at the company. Again, AJ rose to the occasion, providing the product direction that spanned all of engineering, and lead us to pull off what should've been impossible. Just like the first time, we shipped on time. I don't even think I worked late during that iteration of the project.",
      "AJ's leadership during that period allowed us to pull off the impossible, twice. We absolutely could not have done it without her, and I'm so grateful she was there to make all of us successful.",
    ],
    attribution: "Ben T, staff full stack software engineer",
  },
  {
    paragraphs: [
      "I had the chance to work with AJ on one of the cross-team projects, and it was a really positive experience.",
      "They asked great questions, made sure everyone was aligned on the details, and kept communication clear and straightforward throughout. AJ also moved quickly without losing clarity, which made a big impact on the team and the product.",
      "Now, I can definitely see why everyone on my team had such positive feedback about working with AJ.",
      "I'd definitely be happy to work with AJ again.",
    ],
    attribution: "Anna L, senior software engineer",
  },
  {
    paragraphs: [
      "AJ has a strong understanding of both the design system and the product experience, and she's always someone I can turn to for thoughtful, practical guidance.",
      "What stands out most about AJ is how thoroughly she thinks through the work. She considers user needs, business context, technical constraints, and the edge cases that others might miss.",
      "I've also really appreciated how she encourages me to advocate for the user experience. I've learned a lot from working with her.",
    ],
    attribution: "Soyun P, senior product designer",
  },
] as const;

/** Post-it paper colors + tilt; text is black on all notes. Index aligns with testimonials. */
export const KIND_WORDS_POSTITS = [
  { bg: "#f2e45a", rotate: "-2.8deg" },
  { bg: "#f5a3c8", rotate: "2.1deg", hug: true },
  { bg: "#86e9a8", rotate: "-1.6deg" },
  { bg: "#a5d8ff", rotate: "1.4deg" },
  { bg: "#ffd6a5", rotate: "-2.2deg", fullWidthRow: true },
  { bg: "#eebefa", rotate: "1.8deg" },
  { bg: "#99e9f2", rotate: "-1.2deg" },
] as const;

/** Home Kind words section only (board page uses full lists). Isabel, John, Molly, Michael. */
export const HOME_KIND_WORDS_COUNT = 4;
export const homeKindWordsTestimonials = kindWordsTestimonials.slice(0, HOME_KIND_WORDS_COUNT);
export const homeKindWordsPostits = KIND_WORDS_POSTITS.slice(0, HOME_KIND_WORDS_COUNT);

/** Same floating hearts as case study peer feedback; tiled for Kind words scroll. */
export const KIND_WORDS_HEARTS = [
  { left: "5%", top: "12%", size: 18, delay: 0, duration: 8, color: "rgba(0, 174, 239, 0.52)" },
  { left: "18%", top: "58%", size: 14, delay: 1.1, duration: 10, color: "rgba(163, 232, 247, 0.48)" },
  { left: "42%", top: "8%", size: 12, delay: 2.4, duration: 9, color: "rgba(14, 165, 233, 0.44)" },
  { left: "55%", top: "72%", size: 16, delay: 0.6, duration: 11, color: "rgba(56, 189, 248, 0.42)" },
  { left: "72%", top: "18%", size: 13, delay: 3.2, duration: 8.5, color: "rgba(0, 107, 143, 0.5)" },
  { left: "88%", top: "45%", size: 15, delay: 1.8, duration: 9.5, color: "rgba(126, 232, 255, 0.4)" },
  { left: "28%", top: "82%", size: 11, delay: 4, duration: 12, color: "rgba(34, 211, 238, 0.45)" },
  { left: "78%", top: "78%", size: 12, delay: 2, duration: 10.5, color: "rgba(2, 132, 199, 0.46)" },
  { left: "12%", top: "38%", size: 10, delay: 5.5, duration: 13, color: "rgba(103, 232, 249, 0.38)" },
  { left: "92%", top: "12%", size: 14, delay: 0.3, duration: 9, color: "rgba(0, 180, 216, 0.48)" },
] as const;
