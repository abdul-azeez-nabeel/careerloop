/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MeetingDialogue {
  speaker: string;
  role: string;
  avatarColor: string;
  text: string;
}

export interface RealityScenario {
  stageId: string;
  stageNumber: string;
  stageBadge: string;
  
  // Subsection 1: Situation Brief
  briefing: {
    senderName: string;
    senderRole: string;
    subject: string;
    timestamp: string;
    urgency: 'HIGH PRIORITY' | 'URGENT' | 'CONFIDENTIAL' | 'EXECUTIVE ACTION';
    situationOverview: string;
    keyDocuments: { name: string; type: string; size: string }[];
    coreObjective: string;
  };

  // Subsection 2: Technical Drill & Task
  technicalDrill: {
    topicTitle: string;
    doctrineRule: string;
    standardReference: string;
    interactiveTask: {
      question: string;
      options: { label: string; explanation: string; isCorrect: boolean }[];
    };
  };

  // Subsection 3: Meeting Simulation
  meetingSimulation: {
    meetingTitle: string;
    context: string;
    attendees: { name: string; role: string; avatar: string }[];
    transcript: MeetingDialogue[];
    dilemmaPrompt: string;
    dilemmaOptions: { label: string; posture: string; feedback: string }[];
  };

  // Subsection 4: Deliverable
  deliverable: {
    title: string;
    instructions: string;
    templatePlaceholder: string;
    recommendedWordCount: string;
  };
}

export const REALITY_SCENARIOS: Record<string, RealityScenario> = {
  learn: {
    stageId: 'learn',
    stageNumber: '01',
    stageBadge: 'Pre-Qualification · Career Foundations & Ecosystems',
    briefing: {
      senderName: 'Prof. Adeyemi, PhD',
      senderRole: 'Department Chair, Computer Science & Mobile Systems Lab',
      subject: 'URGENT: Mobile Architecture & Memory Leak Challenge Before Graduation',
      timestamp: 'Today at 08:30 AM',
      urgency: 'HIGH PRIORITY',
      situationOverview:
        'As a final-year student aiming for top mobile engineering roles, your university lab team has built an initial mobile application. However, during real-device testing on low-end Android handsets and older iPhones, the app rapidly overheats, stutters, and crashes with Out-Of-Memory (OOM) errors during screen orientation changes. The faculty has set a prerequisite benchmark: you must master mobile operating system lifecycles, memory constraints, and ecosystem tradeoffs before you can qualify for industry internships.',
      keyDocuments: [
        { name: 'Mobile_Lifecycle_State_Machine_Standard.pdf', type: 'Architecture Spec', size: '2.1 MB' },
        { name: 'Android_iOS_Memory_Profiling_Guide.pdf', type: 'Engineering Guide', size: '1.4 MB' },
        { name: 'App_Store_Review_Guidelines_2025.pdf', type: 'Compliance Standard', size: '890 KB' }
      ],
      coreObjective: 'Establish mastery over mobile lifecycle transitions, memory leak prevention, and native vs cross-platform architecture selection.'
    },
    technicalDrill: {
      topicTitle: 'Mobile OS Lifecycle & Retained Context Memory Leak Prevention',
      doctrineRule:
        'Unlike cloud backend servers with abundant virtual memory and constant AC wall power, mobile operating systems (iOS and Android) aggressively reclaim system resources to conserve battery and keep foreground UI at 60/120 FPS.\n\nWhen a mobile screen rotates or the user switches apps, the UI View Controller or Activity is DESTROYED and recreated. If an asynchronous listener, singleton service, or static callback retains a strong reference to that destroyed context, the entire UI view hierarchy cannot be garbage-collected. Accumulating 3-4 leaked views leads to Out-Of-Memory (OOM) crashes.\n\nGolden Rules of Mobile Engineering:\n1. Never pass UI Context or ViewController references to long-lived background singletons.\n2. Always cancel coroutines, async subscriptions, and event listeners in lifecycle destruction callbacks (onDestroy, dispose, deinit).\n3. Save transient user input in onSaveInstanceState / state restoration dictionaries to preserve state during background process death.',
      standardReference: 'Google Android Jetpack Architecture Standards · Apple iOS View Controller Lifecycle Guide',
      interactiveTask: {
        question:
          'A developer registers a continuous WebSocket order-tracking listener inside a mobile checkout screen. When the user taps the back button, the screen closes, but the app crashes with an Out-of-Memory (OOM) error 15 minutes later. What is the root cause and remedy?',
        options: [
          {
            label: 'The WebSocket listener retained a strong reference to the closed screen; unregister the listener in onDestroy/dispose and use a WeakReference.',
            explanation: 'Correct! When the screen is popped from the backstack, the persistent WebSocket listener prevents the garbage collector from freeing the view hierarchy. Cleaning up listeners in lifecycle hooks eliminates the leak.',
            isCorrect: true
          },
          {
            label: 'The mobile device simply lacks sufficient RAM; the user should close background apps before shopping.',
            explanation: 'Incorrect. Professional mobile apps must manage memory responsibly and never blame user device capacity for internal leaks.',
            isCorrect: false
          },
          {
            label: 'Increase the app heap size by adding largeHeap="true" to the AndroidManifest to mask the memory leak.',
            explanation: 'Incorrect. largeHeap is an emergency measure for bitmap editing tools and delays an inevitable crash rather than fixing the leak.',
            isCorrect: false
          }
        ]
      }
    },
    meetingSimulation: {
      meetingTitle: 'CS Capstone Lab Review: Mobile Engineering Foundations',
      context: 'Department Chair Prof. Adeyemi evaluates your foundational knowledge alongside your strict lab lead Marcus and friendly peer Sam.',
      attendees: [
        { name: 'Prof. Adeyemi', role: 'Department Chair & Academic Director', avatar: '👨‍🏫' },
        { name: 'Marcus', role: 'Strict Lab Tech Lead · Demanding & Rigid', avatar: '🧑‍💻' },
        { name: 'Sam', role: 'Relaxed Junior Peer · Fast Prototyper', avatar: '😎' }
      ],
      transcript: [
        {
          speaker: 'Prof. Adeyemi',
          role: 'Academic Director',
          avatarColor: 'sky',
          text: 'Welcome students. Before any of you step into an internship interview at a FinTech or ride-hailing company, you must prove you understand handheld device constraints. What happens when an incoming phone call interrupts an active checkout flow?'
        },
        {
          speaker: 'Marcus',
          role: 'Strict Tech Lead',
          avatarColor: 'rose',
          text: 'Most self-taught developers fail right here! They forget that the OS triggers onPause, then onStop, and can terminate the process at any time! If you did not implement state restoration, the customer loses their cart and money! Show me you know how to save state properly!'
        },
        {
          speaker: 'Sam',
          role: 'Relaxed Junior Peer',
          avatarColor: 'emerald',
          text: 'Take it easy Marcus! Modern frameworks make state management pretty easy with ViewModels and reactive streams. But yeah, losing a user’s transaction because of an incoming phone call is definitely a terrible user experience.'
        }
      ],
      dilemmaPrompt: 'How do you formulate your foundational mobile engineering architectural stance?',
      dilemmaOptions: [
        {
          label: 'Rigorous Lifecycle Discipline',
          posture: 'Best Practice',
          feedback: 'Outstanding! Enforcing state preservation and zero context leaks establishes you as a production-ready mobile engineer.'
        },
        {
          label: 'Rely on Framework Defaults Without Lifecycle Teardown',
          posture: 'Risky Shortcut',
          feedback: 'Warning: Framework defaults do not automatically unregister custom background sockets or sensor listeners.'
        },
        {
          label: 'Assume Modern Handsets Have Endless RAM',
          posture: 'Fatal Flaw',
          feedback: 'Critical Error: Mobile operating systems enforce hard per-app heap limits regardless of physical RAM.'
        }
      ]
    },
    deliverable: {
      title: 'MOBILE ARCHITECTURE & FOUNDATIONAL ECOSYSTEMS WHITE PAPER',
      instructions:
        'Compose a comprehensive technical white paper covering mobile operating system lifecycles, memory leak identification and mitigation, and native vs cross-platform trade-offs across FinTech, HealthTech, and E-Commerce industries.',
      templatePlaceholder:
        '1. EXECUTIVE SUMMARY & MOBILE ECOSYSTEMS OVERVIEW:\n...\n2. MOBILE LIFECYCLE & PROCESS DEATH STATE MANAGEMENT:\n...\n3. MEMORY CONSTRAINTS & LEAK MITIGATION STRATEGY:\n...\n4. PLATFORM SELECTION MATRIX (NATIVE VS CROSS-PLATFORM):\n...',
      recommendedWordCount: '350 - 500 words'
    }
  },

  internship: {
    stageId: 'internship',
    stageNumber: '02',
    stageBadge: 'Practical Lab · Internship & Bug Squashing',
    briefing: {
      senderName: 'Coach Tunde',
      senderRole: 'Senior Mobile Engineer & Intern Mentor at PaySwift',
      subject: 'BUG SQUASH: 60 FPS Scrolling Jank & Offline Transaction Sync',
      timestamp: 'Today at 09:15 AM',
      urgency: 'HIGH PRIORITY',
      situationOverview:
        'Welcome to your first month at PaySwift! We have assigned you to the Core App Team. Beta testers on budget devices are reporting severe scrolling jank (framerate dropping below 30 FPS) on the transaction history feed. Furthermore, users transacting in underground subways or spotty network areas report transactions disappearing when the network cuts out. Coach Tunde has paired with you to squash the main-thread jank and implement local offline caching.',
      keyDocuments: [
        { name: 'PaySwift_Systrace_FrameJank_Trace.json', type: 'Performance Trace', size: '3.8 MB' },
        { name: 'Room_SQLite_Offline_Cache_Spec.sql', type: 'Database Schema', size: '210 KB' },
        { name: 'Figma_Safe_Area_Notch_Tokens.fig', type: 'UI Design Spec', size: '1.2 MB' }
      ],
      coreObjective: 'Eliminate main-thread UI jank to achieve steady 60 FPS scrolling and engineer a resilient offline-first SQLite synchronization layer.'
    },
    technicalDrill: {
      topicTitle: 'Main Thread Frame Budget (16.6ms) & Optimistic Offline UI',
      doctrineRule:
        'A mobile screen refreshing at 60Hz has a strict budget of 16.6 milliseconds per frame (8.3ms on 120Hz ProMotion displays). Any work executed on the Main/UI thread—such as synchronous JSON parsing, database access, or heavy date formatting—exceeds this budget and causes dropped frames (Jank).\n\nCore Implementation Rules:\n1. Offload heavy data decoding and database reads to background worker threads or coroutine dispatchers (Dispatchers.IO / Web Workers / Isolates).\n2. Use view recycling (RecyclerView / FlatList / LazyColumn) with pre-computed immutable layout models.\n3. Implement Optimistic UI: when a user initiates a transaction offline, immediately write it to local SQLite/Room with a "PENDING_SYNC" status, render it on screen instantly, and trigger a background synchronization queue with exponential backoff.',
      standardReference: 'Android Choreographer Frame Budget Guidelines · SQLite/Room Offline-First Standard',
      interactiveTask: {
        question:
          'Beta testers notice that fast-scrolling through 500 transaction records causes severe stuttering. Systrace reveals that DateFormatter and JSON currency conversion run inside onBindViewHolder on the Main Thread. How do you solve this?',
        options: [
          {
            label: 'Move date formatting and currency conversions to background coroutines before binding, passing pre-formatted immutable ViewModels to recycled cells.',
            explanation: 'Correct! Pre-computing formatting off the main thread keeps cell binding under 2 milliseconds, maintaining silky 60 FPS scrolling.',
            isCorrect: true
          },
          {
            label: 'Lower the list frame rate to 20 FPS so the device has more time per frame.',
            explanation: 'Incorrect. Lowering the frame rate creates an unacceptable, sluggish user experience.',
            isCorrect: false
          },
          {
            label: 'Disable view recycling and load all 500 views simultaneously into a ScrollView.',
            explanation: 'Incorrect. Loading 500 views at once consumes enormous memory and guarantees an immediate crash.',
            isCorrect: false
          }
        ]
      }
    },
    meetingSimulation: {
      meetingTitle: 'PaySwift Sprint Standup: Bug Squashing & Performance',
      context: 'Coach Tunde guides your intern progress while strict Tech Lead Marcus inspects your code diff and Product Manager Sarah checks deadlines.',
      attendees: [
        { name: 'Coach Tunde', role: 'Senior Mobile Engineer & Friendly Mentor', avatar: '👨‍🏫' },
        { name: 'Marcus', role: 'Strict Tech Lead · Zero Code Slop', avatar: '🧑‍💻' },
        { name: 'Sarah', role: 'Product Manager · Release Driven', avatar: '👩‍💼' }
      ],
      transcript: [
        {
          speaker: 'Coach Tunde',
          role: 'Mentor',
          avatarColor: 'sky',
          text: 'Great progress this week! Remember, debugging mobile jank is an art. We want our users to feel like the app is responding instantly to their touch.'
        },
        {
          speaker: 'Marcus',
          role: 'Strict Tech Lead',
          avatarColor: 'rose',
          text: 'I reviewed your draft PR. You were creating new SimpleDateFormat objects on every list scroll! That creates hundreds of allocations per second, triggering Garbage Collection pauses. I blocked your PR until you move all formatting into the background repository!'
        },
        {
          speaker: 'Sarah',
          role: 'Product Manager',
          avatarColor: 'amber',
          text: 'Our customer support team is getting flooded with tickets about payments disappearing when riders are in subway tunnels. Can we make sure the local transaction cache renders immediately even when airplane mode is on?'
        }
      ],
      dilemmaPrompt: 'How do you respond to Marcus’s code review critique while satisfying Sarah’s offline requirement?',
      dilemmaOptions: [
        {
          label: 'Adopt Background Formatting & Optimistic Offline Cache',
          posture: 'Pragmatic Engineering',
          feedback: 'Excellent! Pre-formatting data on background threads pleases Marcus, while SQLite optimistic persistence satisfies Sarah.'
        },
        {
          label: 'Push Without Background Workers to Meet Sarah’s Date',
          posture: 'Sloppy Delivery',
          feedback: 'Rejected: Marcus will veto the merge and users on low-end devices will experience severe jank.'
        },
        {
          label: 'Disable Offline Mode Until the Next Quarter',
          posture: 'Unacceptable Compromise',
          feedback: 'Unacceptable: PaySwift requires resilient offline capabilities to compete in emerging markets.'
        }
      ]
    },
    deliverable: {
      title: 'INTERNSHIP BUG SQUASH & OFFLINE ARCHITECTURE SPECIFICATION',
      instructions:
        'Submit your technical intern report detailing the 16.6ms main-thread frame budget diagnosis, background worker implementation, and SQLite/Room offline persistence schema.',
      templatePlaceholder:
        '1. SYSTRACE JANK DIAGNOSIS & MAIN-THREAD AUDIT:\n...\n2. BACKGROUND COROUTINE / WORKER ISOLATE IMPLEMENTATION:\n...\n3. SQLITE/ROOM OFFLINE CACHE SCHEMA & SYNCHRONIZATION QUEUE:\n...\n4. SAFE AREA INSETS & RESPONSIVE MOBILE LAYOUT PROOFS:\n...',
      recommendedWordCount: '350 - 500 words'
    }
  },

  job_prep: {
    stageId: 'job_prep',
    stageNumber: '03',
    stageBadge: 'Recruitment & Assessment · Job Prep & Hiring',
    briefing: {
      senderName: 'Chioma Adebayo',
      senderRole: 'Lead Technical Talent Partner, Apex Mobile Careers',
      subject: 'INTERVIEW INVITATION: Mobile System Design & Live Coding Screening',
      timestamp: 'Today at 10:00 AM',
      urgency: 'HIGH PRIORITY',
      situationOverview:
        'Congratulations on graduating and finishing your internship! You have advanced to the final recruitment rounds for full-time Mobile Engineer positions across top tier tech firms. The hiring process consists of: 1) A live mobile system design challenge (designing an efficient image caching library), 2) Architectural cross-examination (MVVM vs MVI vs Clean Architecture), and 3) Behavioral & compensation negotiation rounds.',
      keyDocuments: [
        { name: 'Live_Coding_LRU_Image_Cache_Prompt.ts', type: 'Coding Task', size: '180 KB' },
        { name: 'Candidate_Mobile_Portfolio_Deck.pdf', type: 'Portfolio', size: '3.2 MB' },
        { name: 'Mobile_Engineer_Salary_Benchmark_2025.pdf', type: 'Compensation Data', size: '640 KB' }
      ],
      coreObjective: 'Excel in live mobile architecture assessments, demonstrate architectural rigor, and master compensation negotiation strategies.'
    },
    technicalDrill: {
      topicTitle: 'Mobile System Design: LRU Memory Cache & Bitmap Downsampling',
      doctrineRule:
        'In mobile engineering interviews, memory constraint management is the primary evaluation signal. When designing an image feed (like Instagram or Uber Eats), loading full 12MP raw camera photos will cause an instant Out-Of-Memory crash (a single 4000x3000 ARGB_8888 bitmap takes 48MB of uncompressed RAM).\n\nCandidate Architectural Blueprint:\n1. Bitmap Downsampling: Read image dimensions first (inJustDecodeBounds = true), calculate the subsample factor matching the screen view pixel size, and decode only the downsampled bitmap.\n2. In-Memory LRU Cache: Allocate a Least-Recently-Used memory cache bounded to 1/8th of the device’s available heap memory.\n3. Disk Cache & HTTP ETags: Cache raw compressed files in internal storage with HTTP cache-control headers, canceling pending network fetch requests for cells that have scrolled off-screen.',
      standardReference: 'Mobile System Design Interview Standards · LRU Memory Cache RFC',
      interactiveTask: {
        question:
          'During a live technical assessment, the interviewer asks: "How do you prevent Out-Of-Memory errors when a user rapidly scrolls through thousands of high-resolution images in a feed?"',
        options: [
          {
            label: 'Downsample bitmaps to target view dimensions, store decoded bitmaps in an LRU memory cache, and cancel pending network requests for cells scrolled off-screen.',
            explanation: 'Correct! Downsampling prevents loading oversized bitmaps, the bounded LRU cache prevents heap bloat, and cancellation avoids wasted bandwidth.',
            isCorrect: true
          },
          {
            label: 'Allocate all device RAM to the image cache and increase virtual heap limits.',
            explanation: 'Incorrect. Mobile OS limits app heap allocations; exceeding limits causes immediate process termination.',
            isCorrect: false
          },
          {
            label: 'Download only low-resolution 50x50 pixel thumbnails for all device screens.',
            explanation: 'Incorrect. Modern high-DPI displays require crisp images matching device pixel density.',
            isCorrect: false
          }
        ]
      }
    },
    meetingSimulation: {
      meetingTitle: 'Final Round Mobile Engineering Interview & Offer Negotiation',
      context: 'Strict Tech Lead Marcus conducts the architectural debrief, while Talent Director Amanda leads the compensation review.',
      attendees: [
        { name: 'Marcus', role: 'Strict Technical Interviewer · Staff Engineer', avatar: '🧑‍💻' },
        { name: 'Amanda', role: 'VP of Talent Acquisition', avatar: '👩‍💼' },
        { name: 'Alex', role: 'Senior Mobile Peer Interviewer', avatar: '👨‍🔬' }
      ],
      transcript: [
        {
          speaker: 'Marcus',
          role: 'Strict Interviewer',
          avatarColor: 'rose',
          text: 'Your LRU cache downsampling explanation was solid. Now defend this: why would you pick MVVM with unidirectional data flow over traditional MVC in a high-concurrency payment app?'
        },
        {
          speaker: 'Alex',
          role: 'Senior Peer',
          avatarColor: 'sky',
          text: 'I checked your GitHub portfolio and internship code. The fact that you handled offline room persistence and frame jank gives you an edge over candidates who only built tutorial clone apps.'
        },
        {
          speaker: 'Amanda',
          role: 'Talent Director',
          avatarColor: 'emerald',
          text: 'We are thrilled with your technical feedback and want to make an initial offer of $48,000 base salary. We know you bring real production internship experience. How do you assess this offer?'
        }
      ],
      dilemmaPrompt: 'How do you formulate your salary negotiation strategy with Amanda while maintaining technical rapport with Marcus?',
      dilemmaOptions: [
        {
          label: 'Data-Driven Value Negotiation',
          posture: 'Strategic Professional',
          feedback: 'Superb! Citing market benchmarks ($58,000 - $65,000), highlighting your proven production delivery, and negotiating stock options secures top compensation.'
        },
        {
          label: 'Accept Initial Offer Without Negotiating',
          posture: 'Passive Acceptance',
          feedback: 'Leaving money on the table: Tech companies expect professional counter-proposals based on market data.'
        },
        {
          label: 'Aggressive Ultimatums Without Data',
          posture: 'Unprofessional Risk',
          feedback: 'Warning: Ultimatums create friction and may lead to offer rescission.'
        }
      ]
    },
    deliverable: {
      title: 'MOBILE SYSTEM DESIGN DOSSIER & COMPENSATION NEGOTIATION INSTRUMENT',
      instructions:
        'Deliver your complete technical interview solution for the high-concurrency LRU image caching engine, architectural design tradeoffs (MVVM vs MVI), and your professional compensation counter-proposal.',
      templatePlaceholder:
        '1. LRU IMAGE CACHING SYSTEM DESIGN & BITMAP DOWNSAMPLING:\n...\n2. STATE MANAGEMENT COMPARISON (MVVM VS MVI VS CLEAN ARCHITECTURE):\n...\n3. BEHAVIORAL STAR PRODUCTION CASE STUDY:\n...\n4. PROFESSIONAL COMPENSATION & EQUITY COUNTER-OFFER INSTRUMENT:\n...',
      recommendedWordCount: '350 - 500 words'
    }
  },

  trainee: {
    stageId: 'trainee',
    stageNumber: '04',
    stageBadge: 'Graduate Trainee · Production Architecture & Mentorship',
    briefing: {
      senderName: 'Tech Lead Emeka',
      senderRole: 'Principal Mobile Architect, NovaBank Digital',
      subject: 'PR REJECTED: Biometric Keystore & Silent Token Refresh Queue',
      timestamp: 'Today at 08:45 AM',
      urgency: 'HIGH PRIORITY',
      situationOverview:
        'You have joined NovaBank Digital as a Graduate Trainee Mobile Engineer! Tech Lead Emeka (demanding, zero tolerance for sloppy code) has rejected your first pull request. When 4 simultaneous network calls fail with 401 Unauthorized after access token expiry, your code fires 4 parallel token refresh requests, causing the authorization server to revoke the refresh token and log out the user! Emeka demands an enterprise-grade synchronized token queue with hardware-backed KeyStore/Keychain biometric security before approval.',
      keyDocuments: [
        { name: 'OAuth2_Token_Race_Condition_Dump.pcap', type: 'Network Trace', size: '2.9 MB' },
        { name: 'Hardware_KeyStore_BiometricPrompt_Spec.pdf', type: 'Security Standard', size: '1.7 MB' },
        { name: 'NovaBank_Code_Review_Rejection_Comments.md', type: 'PR Review', size: '420 KB' }
      ],
      coreObjective: 'Implement a thread-safe token refresh interceptor queue and hardware-backed biometric authentication adhering to strict banking standards.'
    },
    technicalDrill: {
      topicTitle: 'Synchronized Token Refresh Queue & Hardware-Backed KeyStore',
      doctrineRule:
        'In high-security enterprise mobile applications, access tokens expire quickly (every 10-15 minutes). When multiple asynchronous network calls (e.g. notifications, balance, cards, profile) fail simultaneously with HTTP 401 Unauthorized, an uncoordinated HTTP interceptor will trigger multiple concurrent refresh requests. OAuth 2.0 authorization servers with refresh token rotation will detect this as a replay attack and invalidate the entire user session!\n\nArchitectural Requirement:\n1. Mutex / Semaphore Synchronization: The first request to receive a 401 acquires a mutex lock, pauses subsequent 401 requests in a thread-safe queue, issues a single token refresh request, updates the stored bearer token, and then replays all queued calls with the new token.\n2. Hardware-Backed Encryption: Store tokens exclusively in Android KeyStore (MasterKey / EncryptedSharedPreferences) or iOS Keychain with kSecAccessControlBiometryAny protection, ensuring tokens cannot be extracted even on compromised devices.',
      standardReference: 'RFC 6749 OAuth 2.0 Token Revocation · NIST SP 800-63B Hardware Key Storage Standards',
      interactiveTask: {
        question:
          'When 5 parallel API calls receive HTTP 401 Unauthorized simultaneously, how must the mobile HTTP interceptor coordinate the token renewal without triggering session invalidation?',
        options: [
          {
            label: 'Acquire a mutex lock on the first 401, pause other calls in a thread-safe replay queue, execute one refresh request, and replay all queued calls with the new token.',
            explanation: 'Correct! Synchronizing refresh calls prevents duplicate token rotation and maintains seamless background session renewal.',
            isCorrect: true
          },
          {
            label: 'Fire 5 simultaneous refresh requests and overwrite the token with whichever finishes last.',
            explanation: 'Incorrect. Concurrent refresh requests trigger token replay defenses and immediately log the user out.',
            isCorrect: false
          },
          {
            label: 'Force the user back to the login screen whenever any single API returns 401.',
            explanation: 'Incorrect. Routine access token expiration should be refreshed silently in the background without interrupting the user.',
            isCorrect: false
          }
        ]
      }
    },
    meetingSimulation: {
      meetingTitle: 'NovaBank Security Review: Biometrics & Token Queue Audit',
      context: 'Strict Tech Lead Emeka reviews and inspects your revised PR alongside relaxed Product Manager Sam and Chief Security Officer Blessing.',
      attendees: [
        { name: 'Tech Lead Emeka', role: 'Principal Architect · Demanding Reviewer', avatar: '🧑‍💻' },
        { name: 'Sam', role: 'Product Lead · Wants Quick Delivery', avatar: '😎' },
        { name: 'Blessing', role: 'Chief Information Security Officer', avatar: '🕵️‍♀️' }
      ],
      transcript: [
        {
          speaker: 'Tech Lead Emeka',
          role: 'Principal Architect',
          avatarColor: 'rose',
          text: 'In your initial PR, you were storing user tokens in plaintext SharedPreferences! On a rooted or jailbroken phone, any malicious app could read the customer credentials in milliseconds! Have you implemented hardware-backed KeyStore encryption?'
        },
        {
          speaker: 'Sam',
          role: 'Product Lead',
          avatarColor: 'emerald',
          text: 'Emeka, the marketing team announced biometric login for this Friday. Can we merge the basic version now and do the advanced encryption in next month’s sprint?'
        },
        {
          speaker: 'Blessing',
          role: 'CISO',
          avatarColor: 'amber',
          text: 'Absolutely not Sam. NovaBank transacts over $50M daily. Any plain text token vulnerability violates banking compliance and will result in regulatory fines. Emeka’s standards are mandatory.'
        }
      ],
      dilemmaPrompt: 'How do you respond to Tech Lead Emeka’s strict PR block and Blessing’s compliance requirement?',
      dilemmaOptions: [
        {
          label: 'Implement Hardware KeyStore & Thread-Safe Mutex Queue',
          posture: 'Flawless Engineering',
          feedback: 'Bravo! You satisfy Emeka’s exacting standards, pass Blessing’s security audit, and keep the app secure.'
        },
        {
          label: 'Support Sam’s Quick Merge Request',
          posture: 'Severe Compliance Failure',
          feedback: 'Critical Failure: Shipping unencrypted tokens in banking software violates statutory compliance.'
        },
        {
          label: 'Switch to Shorter Token Lifespans Without Encryption',
          posture: 'Evasive Shortcut',
          feedback: 'Ineffective: Shorter lifespans do not protect against local memory extraction on rooted devices.'
        }
      ]
    },
    deliverable: {
      title: 'ENTERPRISE BIOMETRIC AUTH & TOKEN REFRESH ARCHITECTURE PR',
      instructions:
        'Author the formal production Pull Request document detailing the synchronized token refresh interceptor queue, hardware-backed biometric KeyStore/Keychain encryption, and unit test suites.',
      templatePlaceholder:
        '1. THREAD-SAFE TOKEN REFRESH INTERCEPTOR ARCHITECTURE:\n...\n2. MUTEX SYNCHRONIZATION & REPLAY BUFFER WORKFLOW:\n...\n3. HARDWARE-BACKED BIOMETRIC KEYSTORE & KEYCHAIN INTEGRATION:\n...\n4. AUTOMATED CI/CD UNIT TEST PROOFS & SECURITY AUDIT TRAIL:\n...',
      recommendedWordCount: '350 - 500 words'
    }
  },

  junior: {
    stageId: 'junior',
    stageNumber: '05',
    stageBadge: 'Junior Engineer · Production Tasks & Salary Review',
    briefing: {
      senderName: 'Brenda Vance',
      senderRole: 'Director of Mobile Engineering, RapidPay Global',
      subject: 'ANNUAL PERFORMANCE & PROMOTION REVIEW: Junior to Mid-Level Transition',
      timestamp: 'Today at 09:00 AM',
      urgency: 'HIGH PRIORITY',
      situationOverview:
        'You have spent 14 months as a Junior Mobile Engineer at RapidPay Global. You recently engineered and shipped the On-Device KYC Document Scanner with machine learning text recognition, which reduced onboarding drop-off by 28% and saved the business $140,000 in third-party API verification fees. It is time for your annual performance evaluation and promotion pitch to Mid-Level Mobile Engineer, including a 40% salary increment and equity restructuring.',
      keyDocuments: [
        { name: 'KYC_OCR_Production_Metrics_Report.pdf', type: 'Business Impact', size: '2.4 MB' },
        { name: 'RapidPay_Engineering_Career_Ladder.pdf', type: 'Career Matrix', size: '920 KB' },
        { name: 'Annual_Compensation_Review_Proposal.docx', type: 'Salary Proposal', size: '340 KB' }
      ],
      coreObjective: 'Document the production on-device ML scanner architecture and negotiate a 40% salary promotion based on verified business metrics.'
    },
    technicalDrill: {
      topicTitle: 'On-Device Vision ML & CameraX Memory Management',
      doctrineRule:
        'Running on-device Machine Learning (ML Kit / CoreML) for KYC document scanning requires processing 30 camera frames per second. If camera image buffers are not explicitly closed (.close() on ImageProxy) immediately after analysis, the camera hardware pipeline starves, freezing the viewfinder.\n\nProduction Rules:\n1. Reusable Image Analysis Buffer: Maintain a single reusable image analysis buffer, processing frames selectively (throttle analysis to 5 FPS while keeping viewfinder rendering at 60 FPS).\n2. Hardware Lifecycle Clean-up: Always release camera hardware locks and background ML worker threads in onStop to avoid battery drain and overheating.\n3. Dynamic Lighting Adaptation: Implement local threshold contrast algorithms before tensor inference to support poor lighting conditions without cloud network roundtrips.',
      standardReference: 'CameraX ImageAnalysis Production Guidelines · CoreML High-Efficiency Pipeline Standards',
      interactiveTask: {
        question:
          'During on-device KYC document scanning, the camera preview freezes after 3 seconds on older Android devices. What is the standard technical fix?',
        options: [
          {
            label: 'Explicitly invoke imageProxy.close() inside the onComplete listener of the ML detector so the camera buffer pool is recycled for subsequent frames.',
            explanation: 'Correct! Failing to close ImageProxy starves the camera pipeline; closing it in the completion callback allows smooth continuous streaming.',
            isCorrect: true
          },
          {
            label: 'Lower camera resolution to 240p and disable autofocus completely.',
            explanation: 'Incorrect. Low resolution prevents the OCR model from extracting legible text from identity documents.',
            isCorrect: false
          },
          {
            label: 'Restart the entire camera activity every 3 seconds automatically.',
            explanation: 'Incorrect. Restarting activities causes jarring flickering and severe battery consumption.',
            isCorrect: false
          }
        ]
      }
    },
    meetingSimulation: {
      meetingTitle: 'Annual Promotion & Salary Negotiation Board',
      context: 'Director Brenda Vance and HR Compensation Director Marcus evaluate your performance metrics and promotion proposal.',
      attendees: [
        { name: 'Brenda Vance', role: 'Director of Mobile Engineering', avatar: '👩‍💼' },
        { name: 'Marcus', role: 'VP of HR & Compensation Committee', avatar: '🧑‍💼' },
        { name: 'David', role: 'Lead Mobile Architect & Mentor', avatar: '👨‍💻' }
      ],
      transcript: [
        {
          speaker: 'Brenda Vance',
          role: 'Director of Mobile',
          avatarColor: 'sky',
          text: 'Your delivery of the on-device KYC document scanner was one of the highest-impact junior achievements of the year. The 28% drop-off reduction directly propelled our Q3 growth numbers.'
        },
        {
          speaker: 'David',
          role: 'Lead Architect',
          avatarColor: 'indigo',
          text: 'Architecturally, your CameraX buffer handling and memory isolation were flawless. You operate with minimal supervision and actively mentor our new interns.'
        },
        {
          speaker: 'Marcus',
          role: 'Compensation Director',
          avatarColor: 'emerald',
          text: 'We are eager to promote you to Mid-Level Mobile Engineer. Our standard internal promotion guidelines offer a 15% salary bump. What is your proposal?'
        }
      ],
      dilemmaPrompt: 'How do you conduct your salary negotiation for a 40% promotion raise to mid-level market rate?',
      dilemmaOptions: [
        {
          label: 'Data-Backed Business Impact & Market Rate Negotiation',
          posture: 'Strategic & High-Impact',
          feedback: 'Brilliant! Documenting $140,000 in saved API costs and benchmark mid-level salaries ($95,000 - $110,000) justifies a 38-42% promotion increase.'
        },
        {
          label: 'Accept 15% Standard Internal Policy',
          posture: 'Under-Valued Settlement',
          feedback: 'Sub-optimal: You delivered outsized mid-level value and should negotiate for competitive market rates.'
        },
        {
          label: 'Threaten Immediate Resignation Without Discussion',
          posture: 'Hostile Confrontation',
          feedback: 'Counterproductive: Aggressive hostility alienates supportive leadership.'
        }
      ]
    },
    deliverable: {
      title: 'JUNIOR-TO-MID PROMOTION DOSSIER & SALARY NEGOTIATION INSTRUMENT',
      instructions:
        'Formulate your comprehensive promotion document detailing the on-device ML scanner architecture, operational cost savings, and structured compensation counter-proposal.',
      templatePlaceholder:
        '1. ON-DEVICE KYC VISION ML ARCHITECTURE & CAMERAX PIPELINE:\n...\n2. QUANTIFIABLE BUSINESS IMPACT ($140K SAVINGS & 28% ONBOARDING LIFT):\n...\n3. LEADERSHIP & INTERN MENTORSHIP CONTRIBUTIONS:\n...\n4. FORMAL SALARY PROMOTION COUNTER-PROPOSAL & EQUITY RESTRUCTURING:\n...',
      recommendedWordCount: '350 - 500 words'
    }
  },

  mid: {
    stageId: 'mid',
    stageNumber: '06',
    stageBadge: 'Mid-Level Engineer · Refactoring & Multi-Module Architecture',
    briefing: {
      senderName: 'Marcus Vance',
      senderRole: 'Staff Mobile Architect, MetroRide (1.5M Daily Users)',
      subject: 'CODEBASE RESCUE: Monolith Multi-Module Split & 1.2s Launch Budget',
      timestamp: 'Today at 08:30 AM',
      urgency: 'HIGH PRIORITY',
      situationOverview:
        'As a Mid-Level Mobile Engineer at MetroRide (1.5M daily active riders), the monolithic codebase has become an operational bottleneck: clean CI builds take 22 minutes, cold app startup has bloated to 3.8 seconds (violating Google Play Vitals), and developers suffer constant merge conflicts. You are caught between relaxed PM Sam (who wants 5 new rider features shipped immediately) and strict Staff Architect Marcus (who blocks any release that adds 50ms to startup time). You must lead the Multi-Module Architecture migration.',
      keyDocuments: [
        { name: 'MetroRide_Dependency_Graph_Monolith.svg', type: 'Architecture Graph', size: '4.1 MB' },
        { name: 'Android_Vitals_Cold_Startup_Flamegraph.pprof', type: 'Flamegraph Trace', size: '2.8 MB' },
        { name: 'Multi_Module_Modularization_RFC.md', type: 'Design Proposal', size: '780 KB' }
      ],
      coreObjective: 'Architect a scalable multi-module dependency graph, optimize cold app startup under 1.2s, and balance strict vs relaxed superior demands.'
    },
    technicalDrill: {
      topicTitle: 'Multi-Module Graph Isolation & App Startup Deferral',
      doctrineRule:
        'In large-scale mobile engineering, monolithic codebases cause circular dependencies and slow build times. Multi-module architecture isolates features into discrete build units: ":core:network", ":core:designsystem", ":feature:rides", and ":feature:wallet".\n\nModularization & Startup Rules:\n1. Dependency Direction: Feature modules may depend on Core modules, but feature modules MUST NEVER depend on other feature modules. Cross-feature navigation is coordinated via deep links or a centralized Navigator interface.\n2. Startup Budget (Sub-1.2s): Avoid initializing analytics, ad networks, and crash loggers synchronously in Application.onCreate(). Use the App Startup library to initialize only essential network/security libraries synchronously, deferring non-essential SDKs to background coroutines after the first UI frame draws.\n3. Compile-Time Optimization: Use "implementation" instead of "api" in build configurations to prevent leakage of transitive dependencies, enabling incremental caching across build targets.',
      standardReference: 'Google Android App Modularization Guide · Apple Swift Package Manager Modularization Standards',
      interactiveTask: {
        question:
          'Cold app startup takes 3.8 seconds because 12 third-party analytics and ad SDKs initialize synchronously in Application.onCreate() on the Main Thread. What is the architectural solution?',
        options: [
          {
            label: 'Modularize SDK initialization using App Startup, initializing only critical network/security components synchronously and deferring analytics to background tasks after first frame render.',
            explanation: 'Correct! Deferring non-critical initializations slashes cold launch times down to sub-1.2 seconds, satisfying Android Vitals standards.',
            isCorrect: true
          },
          {
            label: 'Display a splash screen for 4 seconds so the user cannot see the initialization lag.',
            explanation: 'Incorrect. Splash screens do not reduce startup latency and worsen user churn rates.',
            isCorrect: false
          },
          {
            label: 'Delete all analytics and crash reporting libraries completely from the app.',
            explanation: 'Incorrect. Production apps require crash reporting and telemetry to diagnose real-world regressions.',
            isCorrect: false
          }
        ]
      }
    },
    meetingSimulation: {
      meetingTitle: 'MetroRide Architecture Council: Strict Tech Lead vs Relaxed Product Manager',
      context: 'Staff Architect Marcus (strict) and Product Manager Sam (relaxed) clash over feature velocity versus structural modularization.',
      attendees: [
        { name: 'Marcus', role: 'Staff Architect · Demanding & Rigid', avatar: '🧑‍💻' },
        { name: 'Sam', role: 'Senior Product Manager · Relaxed & Fast Delivery', avatar: '😎' },
        { name: 'Jessica', role: 'Engineering Manager · Team Leader', avatar: '👩‍💼' }
      ],
      transcript: [
        {
          speaker: 'Marcus',
          role: 'Staff Architect',
          avatarColor: 'rose',
          text: 'Our Google Play Vitals are in the danger zone! 3.8-second launch times are causing a 12% ride booking drop-off! I will reject every pull request from Sam’s team until we modularize and bring startup times below 1.5 seconds!'
        },
        {
          speaker: 'Sam',
          role: 'Product Manager',
          avatarColor: 'emerald',
          text: 'Come on Marcus! Uber and Lyft just launched ride-splitting! If we freeze features for 2 months to do abstract refactoring, our competitor will eat our market share! Why can’t we build the feature now and refactor later?'
        },
        {
          speaker: 'Jessica',
          role: 'Engineering Manager',
          avatarColor: 'amber',
          text: 'We need our Mid-Level engineer to propose a realistic compromise that protects both architectural health and commercial release velocity.'
        }
      ],
      dilemmaPrompt: 'How do you mediate between strict Marcus and relaxed Sam?',
      dilemmaOptions: [
        {
          label: 'Phased Modularization with Startup Optimization',
          posture: 'Pragmatic Leadership',
          feedback: 'Exceptional! Deferring SDKs immediately fixes the 1.2s launch issue to satisfy Marcus, while modularizing feature modules unblocks Sam’s team to build ride-splitting in parallel.'
        },
        {
          label: 'Side Completely with Sam to Rush Features',
          posture: 'Technical Debt Trap',
          feedback: 'Short-sighted: Startup latency will worsen, triggering Google Play algorithm downranking.'
        },
        {
          label: 'Freeze All Development for 6 Months',
          posture: 'Business Suicide',
          feedback: 'Unacceptable: Complete feature freezes cause revenue loss and competitive disadvantage.'
        }
      ]
    },
    deliverable: {
      title: 'MULTI-MODULE MIGRATION RFC & COLD STARTUP OPTIMIZATION BLUEPRINT',
      instructions:
        'Deliver your engineering Request for Comments (RFC) outlining module boundary definitions, startup deferral sequence, and stakeholder alignment strategy.',
      templatePlaceholder:
        '1. CURRENT MONOLITHIC BOTTLENECKS & BUILD TIME AUDIT:\n...\n2. MULTI-MODULE GRAPH ARCHITECTURE (:CORE VS :FEATURE SEPARATION):\n...\n3. COLD STARTUP DEFERRAL BLUEPRINT (3.8S -> 1.2S OPTIMIZATION):\n...\n4. BALANCED ROADMAP: UNBLOCKING PRODUCT VELOCITY & STRICT GOVERNANCE:\n...',
      recommendedWordCount: '350 - 500 words'
    }
  },

  senior: {
    stageId: 'senior',
    stageNumber: '07',
    stageBadge: 'Senior Mobile Engineer · Architecture, Mentorship & Strategy',
    briefing: {
      senderName: 'Helena Berg',
      senderRole: 'VP of Engineering, Global Mobile Platforms',
      subject: 'GLOBAL EXPANSION: Multi-Region CDN Routing & Principal Promotion',
      timestamp: 'Today at 09:30 AM',
      urgency: 'HIGH PRIORITY',
      situationOverview:
        'You are the Senior Mobile Engineer directing 16 mobile engineers across iOS and Android. The company is launching operations in 4 new international regions with constrained cellular bandwidth and strict local data residency requirements. You are responsible for global dynamic feature bundling, edge CDN routing, and junior developer mentorship. Concurrently, you are in executive negotiations for promotion to Staff/Principal Mobile Engineer with an equity grant restructuring.',
      keyDocuments: [
        { name: 'Global_Latency_MultiRegion_Audit.csv', type: 'Telemetry Data', size: '3.6 MB' },
        { name: 'Staff_Principal_Compensation_TermSheet.pdf', type: 'Executive Term Sheet', size: '890 KB' },
        { name: 'Mobile_Team_Mentorship_Framework.md', type: 'Team Guidelines', size: '540 KB' }
      ],
      coreObjective: 'Engineer global dynamic app delivery, establish team mentorship standards, and structure an executive equity compensation agreement.'
    },
    technicalDrill: {
      topicTitle: 'Dynamic Feature Bundling & Multi-Region Edge Latency',
      doctrineRule:
        'Distributing a 120MB universal app binary over cellular networks in emerging markets leads to a 42% download abandonment rate on Google Play and Apple App Store.\n\nSenior Engineering Standards:\n1. Dynamic Feature Delivery: Split the application into Android Dynamic Feature Modules / iOS On-Demand Resources. Keep the core initial download under 25MB (containing authentication and onboarding), streaming secondary modules (e.g. video verification, regional localized banking) on-demand in the background.\n2. Multi-Region Edge CDN Routing: Route all mobile API requests through Anycast DNS and Edge CDN workers with TLS 1.3 session resumption to minimize Round-Trip-Time (RTT) for distant mobile clients.\n3. Junior Mentorship Program: Maintain strict peer review checklists, automated linting rules, and weekly pair-programming sessions to upskill junior developers without bottlenecking release cadences.',
      standardReference: 'Google Play Feature Delivery Specifications · Apple On-Demand Resources Standards',
      interactiveTask: {
        question:
          'International users in bandwidth-constrained markets abandon downloads because the universal app bundle is 120MB. How do you reduce initial download size to under 25MB without removing features?',
        options: [
          {
            label: 'Split the app into Dynamic Feature Modules / On-Demand Resources, delivering a 22MB base bundle with essential onboarding, while streaming secondary features on-demand.',
            explanation: 'Correct! Dynamic modular delivery keeps initial install sizes tiny while downloading heavy assets only when requested by the user.',
            isCorrect: true
          },
          {
            label: 'Apply lossy compression to all image assets until icons become visibly blurry.',
            explanation: 'Incorrect. Severely degraded graphics harm brand credibility and violate App Store quality standards.',
            isCorrect: false
          },
          {
            label: 'Host APK files on an external website and ask users to download via browser.',
            explanation: 'Incorrect. Bypassing official App Stores triggers security warnings and destroys user trust.',
            isCorrect: false
          }
        ]
      }
    },
    meetingSimulation: {
      meetingTitle: 'Executive Leadership Review & Principal Compensation Negotiation',
      context: 'VP of Engineering Helena Berg and Compensation Director Richard review your global technical architecture and equity terms.',
      attendees: [
        { name: 'Helena Berg', role: 'VP of Engineering', avatar: '👩‍💼' },
        { name: 'Richard', role: 'Head of Executive Compensation & Board Member', avatar: '🧑‍💼' },
        { name: 'Tariq', role: 'Senior Product Director · Global Markets', avatar: '👨‍💼' }
      ],
      transcript: [
        {
          speaker: 'Helena Berg',
          role: 'VP of Engineering',
          avatarColor: 'sky',
          text: 'Your dynamic modular delivery architecture reduced initial install size from 120MB to 22MB, producing a 35% increase in install conversion across Latin America and Africa. Furthermore, your junior engineers have flourished under your mentorship.'
        },
        {
          speaker: 'Tariq',
          role: 'Product Director',
          avatarColor: 'indigo',
          text: 'The overseas telemetry numbers are remarkable. API latency dropped by 420ms through Anycast edge routing. We hit all international expansion milestones.'
        },
        {
          speaker: 'Richard',
          role: 'Executive Compensation',
          avatarColor: 'emerald',
          text: 'The executive committee is delighted to confirm your promotion to Principal Mobile Architect. Our initial offer is $150,000 base salary plus 15,000 stock options vesting over 4 years. How do you wish to structure this agreement?'
        }
      ],
      dilemmaPrompt: 'How do you structure your senior executive compensation and equity package?',
      dilemmaOptions: [
        {
          label: 'Executive Equity Optimization with Accelerated Vesting',
          posture: 'Strategic Wealth Creation',
          feedback: 'Exceptional! Counter-proposing $165,000 base, 25,000 stock options with a 1-year cliff, and accelerated vesting on change-of-control aligns your leadership with company valuation.'
        },
        {
          label: 'Request 100% Cash and Decline All Equity',
          posture: 'Short-Sighted Liquidity',
          feedback: 'Missed Opportunity: Pre-IPO equity grants are where principal software architects create generational wealth.'
        },
        {
          label: 'Accept Initial Offer Without Reviewing Vesting Schedule',
          posture: 'Passive Acceptance',
          feedback: 'Sub-optimal: Senior executive roles always negotiate vesting schedules, severance terms, and bonus tiers.'
        }
      ]
    },
    deliverable: {
      title: 'GLOBAL MOBILE ARCHITECTURE BLUEPRINT & PRINCIPAL COMPENSATION INSTRUMENT',
      instructions:
        'Deliver your comprehensive senior engineering white paper detailing dynamic module delivery, multi-region edge routing, junior mentorship frameworks, and executive equity terms.',
      templatePlaceholder:
        '1. DYNAMIC FEATURE DELIVERY & APP BUNDLE STRATEGY (120MB -> 22MB):\n...\n2. MULTI-REGION ANYCAST EDGE ROUTING & LATENCY OPTIMIZATION:\n...\n3. JUNIOR DEVELOPER MENTORSHIP & CODE QUALITY GOVERNANCE:\n...\n4. PRINCIPAL ARCHITECT EXECUTIVE COMPENSATION & EQUITY RESTRUCTURING:\n...',
      recommendedWordCount: '350 - 500 words'
    }
  },

  lead: {
    stageId: 'lead',
    stageNumber: '08',
    stageBadge: 'Head of Mobile / VP · Board Strategy & IPO Readiness',
    briefing: {
      senderName: 'Victoria Sterling',
      senderRole: 'Chief Executive Officer (CEO), MetroGlobal Technologies',
      subject: 'BOARD OF DIRECTORS PRESENTATION: 5-Year Mobile Tech Strategy & IPO TCO',
      timestamp: 'Today at 08:00 AM',
      urgency: 'EXECUTIVE ACTION',
      situationOverview:
        'You have reached the apex of your career: Head of Mobile Engineering / VP of Mobile, leading an organization of 48 engineers, designers, and mobile DevOps specialists. As MetroGlobal approaches an Initial Public Offering (IPO), the Board of Directors is fiercely divided: investor board members want to rewrite the entire mobile stack into a cross-platform framework (Flutter or React Native) to cut engineering payroll by 35%, while the CTO insists that maintaining Dual Native (Swift and Kotlin) is critical for performance, security, and zero-day OS adoption. You must deliver the definitive board presentation.',
      keyDocuments: [
        { name: 'Board_Presentation_DualNative_vs_CrossPlatform_TCO.pptx', type: 'Board Deck', size: '5.4 MB' },
        { name: 'Mobile_Engineering_Salary_Bands_Ladder.xlsx', type: 'Org Structure', size: '1.1 MB' },
        { name: 'Pre_IPO_Mobile_Penetration_Security_Audit.pdf', type: 'Audit Report', size: '2.3 MB' }
      ],
      coreObjective: 'Deliver the 5-year technology strategy to the Board of Directors, defend long-term engineering velocity, and govern enterprise mobile systems.'
    },
    technicalDrill: {
      topicTitle: 'Total Cost of Ownership (TCO) & Dual-Native vs Unified Cross-Platform',
      doctrineRule:
        'At the executive VP/Head level, technology decisions are investment strategies measured by Total Cost of Ownership (TCO), developer velocity, and business continuity risk.\n\nExecutive Analysis Framework:\n1. Cross-Platform Total Rewrite Risk: Freezing all mobile feature development for 12-16 months to rewrite two mature native codebases into Flutter/React Native forfeits hundreds of millions in competitor market share. Furthermore, cross-platform abstraction layers introduce bridging latency for hardware peripherals (biometrics, secure enclave, Bluetooth) and delay adoption of zero-day OS capabilities.\n2. Hybrid Modernization Strategy: Rather than a high-risk full rewrite or maintaining isolated silos, top mobile organizations adopt Kotlin Multiplatform (KMP) or shared C++ libraries for core business logic, cryptography, and network models, while keeping native Swift (SwiftUI) and Kotlin (Jetpack Compose) for UI rendering.\n3. Enterprise Governance & Security: Enforce anti-tampering, runtime application self-protection (RASP), certificate pinning, and standardized career ladder bands to maintain team retention before public listing.',
      standardReference: 'IEEE Enterprise Mobile Architecture Standard · Gartner Mobile Platform Evaluation Matrix',
      interactiveTask: {
        question:
          'Investor board members propose freezing all mobile product features for 14 months to rewrite two high-revenue native iOS/Android apps into a cross-platform framework to reduce engineering headcount by 30%. What is the executive recommendation?',
        options: [
          {
            label: 'Oppose the total feature freeze rewrite; adopt a Pragmatic Hybrid Strategy with shared core business logic (Kotlin Multiplatform) while preserving native UI layers and continuous feature delivery.',
            explanation: 'Correct! A shared-logic hybrid approach cuts maintenance duplication without the catastrophic revenue loss and market surrender of a 14-month product freeze.',
            isCorrect: true
          },
          {
            label: 'Agree to freeze all customer features for 14 months and fire half the native developers immediately.',
            explanation: 'Incorrect. Halting feature development for over a year destroys market valuation and hands victory to competitors.',
            isCorrect: false
          },
          {
            label: 'Abandon mobile applications entirely and transition users to responsive web pages.',
            explanation: 'Incorrect. Mobile apps generate over 80% of customer engagement and revenue for top technology enterprises.',
            isCorrect: false
          }
        ]
      }
    },
    meetingSimulation: {
      meetingTitle: 'Board of Directors Strategic Technology & Governance Session',
      context: 'CEO Victoria Sterling, Lead Investor Arthur, and CTO David review and evaluate your 5-year mobile technology roadmap ahead of the IPO.',
      attendees: [
        { name: 'Victoria Sterling', role: 'Chief Executive Officer · Valuation Focused', avatar: '👩‍💼' },
        { name: 'Arthur', role: 'Lead Investor & Board Member · Cost Cutting', avatar: '🧑‍💼' },
        { name: 'David', role: 'Chief Technology Officer · Engineering Visionary', avatar: '👨‍💻' }
      ],
      transcript: [
        {
          speaker: 'Arthur',
          role: 'Lead Investor',
          avatarColor: 'rose',
          text: 'We spend $7.2M annually on separate iOS and Android engineering teams! Other portfolio companies use Flutter or React Native with half the headcount! Why shouldn’t we mandate an immediate rewrite before our IPO filing?'
        },
        {
          speaker: 'David',
          role: 'CTO',
          avatarColor: 'indigo',
          text: 'Because an immediate rewrite means freezing all revenue-generating features for 14 months! Our apps rely on custom Bluetooth hardware pairing, low-level Metal shaders, and biometric security enclaves. An abstraction layer introduces latency and crashes!'
        },
        {
          speaker: 'Victoria Sterling',
          role: 'CEO',
          avatarColor: 'emerald',
          text: 'We look to our Head of Mobile for the definitive executive direction. What is our roadmap that satisfies shareholder financial efficiency without destroying engineering excellence?'
        }
      ],
      dilemmaPrompt: 'How do you deliver your strategic technology governance to the Board of Directors?',
      dilemmaOptions: [
        {
          label: 'Pragmatic Hybrid Architecture (Shared KMP Logic + Native UI)',
          posture: 'Masterclass Executive Leadership',
          feedback: 'Triumphant! You protect continuous revenue delivery, reduce maintenance costs through shared domain logic, and win unanimous Board approval.'
        },
        {
          label: 'Capitulate to Arthur and Impose a 14-Month Feature Freeze',
          posture: 'Catastrophic Market Surrender',
          feedback: 'Disastrous: Competitors seize your market share during the freeze, undermining IPO valuation.'
        },
        {
          label: 'Refuse Financial Discussions and Dismiss Investor Concerns',
          posture: 'Executive Incompetence',
          feedback: 'Unacceptable: Senior technology executives must articulate business ROI and financial TCO to shareholders.'
        }
      ]
    },
    deliverable: {
      title: 'EXECUTIVE BOARD PRESENTATION: 5-YEAR MOBILE TECH ROADMAP & IPO TCO GOVERNANCE',
      instructions:
        'Deliver your comprehensive Board of Directors white paper detailing the 5-year technology strategy, Total Cost of Ownership (TCO) financial model, engineering organizational ladder, and pre-IPO security governance.',
      templatePlaceholder:
        '1. EXECUTIVE SUMMARY & PRE-IPO MOBILE TECHNOLOGY STRATEGY:\n...\n2. 5-YEAR TCO ANALYSIS: DUAL NATIVE VS CROSS-PLATFORM VS KMP HYBRID:\n...\n3. RISK MITIGATION: ZERO-FEATURE-FREEZE CONTINUOUS REVENUE DELIVERY:\n...\n4. MOBILE ENGINEERING ORGANIZATION STRUCTURE, SALARY BANDS & TALENT GOVERNANCE:\n...',
      recommendedWordCount: '400 - 600 words'
    }
  }
};
