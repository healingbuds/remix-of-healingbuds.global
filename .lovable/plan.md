

# AI-Generated High-Quality Images for Statistics Section

## Overview

Generate 4 unique, high-quality 4K realistic images using AI image generation (Nano Banana Pro model) specifically designed for each statistic card. Each image will be crafted using marketing psychology principles relevant to a medical cannabis healthcare company.

---

## Image Strategy & Marketing Psychology

| Card | Current Image | New Image Concept | Psychology Principle |
|------|---------------|-------------------|---------------------|
| **Hero (Cultivation)** | Reused cultivation photo | Aerial view of massive greenhouse facility at golden hour | **Scale & Authority** - Bird's eye shows vastness, golden light = premium quality |
| **Research Partners** | Reused lab photo | Scientists in lab coats collaborating over cannabis samples | **Social Proof & Expertise** - Shows human collaboration, trust through expertise |
| **Countries (Global)** | No image (SVG only) | World map with glowing connection lines and cannabis leaf motif | **Global Reach** - Network visualization builds confidence in distribution |
| **Trust Banner (EU GMP)** | Reused docs photo | Clean pharmaceutical production line with quality control | **Clinical Trust** - Sterile, precise environment = reliability and safety |

---

## Image Specifications

### 1. Hero Card: "Vast Cultivation Facility"

**Prompt:**
```
Photorealistic 4K aerial drone view of a massive modern cannabis greenhouse facility 
at golden hour sunset, 18000 square meters of pristine glass cultivation space, 
lush green cannabis plants in perfect rows, professional agricultural infrastructure, 
EU-standard pharmaceutical quality, warm golden sunlight streaming through, 
professional architectural photography style, sharp detail, no people, 
cinematic lighting, shallow depth of field on foreground plants
```

**Psychology:**
- **Authority**: Aerial perspective conveys scale and dominance
- **Premium Quality**: Golden hour lighting = luxury and value
- **Trust**: Organized, symmetrical rows = precision and reliability
- **Aspiration**: Beautiful facility = pride in operations

---

### 2. Research Card: "Collaborative Scientists"

**Prompt:**
```
Photorealistic 4K image of two diverse scientists in white lab coats 
examining cannabis samples under professional laboratory equipment, 
modern pharmaceutical research lab setting, soft clinical lighting, 
scientific instruments and microscopes visible, focused professional expressions, 
one scientist holding a petri dish with cannabis extract, clean white 
and teal color palette, shallow depth of field, professional medical photography, 
trust-building healthcare imagery
```

**Psychology:**
- **Social Proof**: Multiple experts validates credibility
- **Expertise**: Lab coats and equipment = professional competence
- **Diversity**: Inclusive representation broadens appeal
- **Engagement**: Human faces create emotional connection

---

### 3. Countries Card: "Global Network"

**Prompt:**
```
Photorealistic 4K stylized world map visualization with glowing emerald 
connection lines between major cities (London, Lisbon, Bangkok, Johannesburg), 
subtle cannabis leaf watermark overlay, dark teal background, 
premium infographic design, soft ambient lighting on connection points, 
professional data visualization aesthetic, pharmaceutical brand quality, 
network nodes pulsing with soft green light
```

**Psychology:**
- **Reach**: Visual connections prove global capability
- **Movement**: Glowing lines suggest active distribution
- **Modern**: Data visualization aesthetic = innovation
- **Confidence**: Many connection points = established network

---

### 4. Trust Banner: "EU GMP Production Line"

**Prompt:**
```
Photorealistic 4K pharmaceutical production facility interior, 
sterile clean room with cannabis oil extraction equipment, 
workers in full protective gear and hairnets, stainless steel machinery, 
EU GMP certification visible on wall, clinical white and soft teal lighting, 
quality control tablets and digital displays showing compliance data, 
professional industrial photography, shallow depth of field, 
trust and precision aesthetic
```

**Psychology:**
- **Clinical Trust**: Sterile environment = safety and quality
- **Transparency**: Visible certification = accountability
- **Professionalism**: Protective gear = pharmaceutical-grade operations
- **Technology**: Modern equipment = cutting-edge processes

---

## Implementation Plan

### Step 1: Generate Images via Edge Function

Create an edge function that uses the Nano Banana Pro model (`google/gemini-3-pro-image-preview`) for highest quality output:

```typescript
// supabase/functions/generate-stats-images/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const prompts = {
  cultivation: "Photorealistic 4K aerial drone view...",
  research: "Photorealistic 4K image of two diverse scientists...",
  global: "Photorealistic 4K stylized world map...",
  trust: "Photorealistic 4K pharmaceutical production facility..."
};

serve(async (req) => {
  const { imageType } = await req.json();
  
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-3-pro-image-preview",
      messages: [{ role: "user", content: prompts[imageType] }],
      modalities: ["image", "text"]
    })
  });
  
  const data = await response.json();
  const imageBase64 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  
  // Upload to Supabase Storage
  // Return public URL
});
```

### Step 2: Create Storage Bucket

Create a `statistics-images` bucket in Supabase Storage for the generated images.

### Step 3: Update Component

```tsx
// Updated imports
import cultivationImage from "@/assets/generated/stats-cultivation.jpg";
import researchImage from "@/assets/generated/stats-research.jpg";
import globalImage from "@/assets/generated/stats-global.jpg";
import trustImage from "@/assets/generated/stats-trust.jpg";
```

---

## File Changes Summary

| File | Change |
|------|--------|
| `supabase/functions/generate-stats-images/index.ts` | New edge function for AI image generation |
| Database migration | Create storage bucket for generated images |
| `src/components/AnimatedStatistics.tsx` | Update to use new generated images |

---

## Alternative: Direct Generation Approach

If you prefer not to set up an edge function, I can generate the images directly during this session using the AI image generation capability and save them to Supabase Storage for immediate use.

---

## Image Quality Guarantee

- **Model**: Using `google/gemini-3-pro-image-preview` (Nano Banana Pro) for highest quality
- **Resolution**: 4K photorealistic output
- **Style**: Professional commercial photography aesthetic
- **Relevance**: Each image directly supports the statistic it accompanies

---

## Marketing Psychology Applied

| Principle | Application |
|-----------|-------------|
| **Authority** | Aerial cultivation shot shows scale and industry leadership |
| **Social Proof** | Multiple scientists validate research credibility |
| **Trust** | Clinical production environment conveys pharmaceutical standards |
| **Global Reach** | Network visualization proves distribution capability |
| **Premium Quality** | Golden hour lighting and clean aesthetics signal value |

