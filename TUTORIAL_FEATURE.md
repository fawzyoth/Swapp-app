# Interactive Tutorial Feature

## Overview
The merchant tutorial is a comprehensive, interactive onboarding flow that teaches new merchants how to use the SWAPP platform effectively. It covers QR code generation, packaging instructions, the exchange process, video verification, and client communication.

## Features

### 7-Step Interactive Tutorial

#### Step 1: Welcome & Overview
- Introduction to SWAPP platform
- Overview of key features (QR Codes, Video verification, Validation)
- List of what merchants will learn
- Engaging visual design with feature highlights

#### Step 2: QR Code Generation
- How QR codes work
- Step-by-step generation process
- Benefits of QR code system
- Visual mock-up of QR code
- Reusability and tracking features

#### Step 3: Printing & Placement
- Printing instructions (format, size, paper type)
- Correct placement on packages
- Visual example with package diagram
- Do's and Don'ts for QR code placement
- Best practices for visibility

#### Step 4: Client Exchange Process
- 4-step client workflow explanation
- Scanner → Form → Video → Submit
- Example mock exchange request
- What merchants receive
- Real-time notifications

#### Step 5: Video Verification
- Importance of video proof
- Livreur (delivery person) verification process
- Protection against fraud
- Accepted vs Rejected scenarios
- Visual comparison flow

#### Step 6: Communication
- Real-time chat features
- Mock conversation example
- Automatic notifications
- Review system integration
- Client satisfaction tracking

#### Step 7: Completion & Next Steps
- Congratulations screen
- Feature recap summary
- Recommended next actions
- Quick start checklist

## User Experience

### Navigation
- **Progress Bar**: Visual indicator showing completion percentage
- **Step Indicators**: Numbered circles showing all steps
- **Previous/Next Buttons**: Easy navigation between steps
- **Skip Option**: "Passer le tutoriel" button always available

### Progress Tracking
- LocalStorage key: `merchant_tutorial_completed`
- Persistent across sessions
- Can be reset for re-viewing

### Visual Design
- Gradient backgrounds (blue to purple theme)
- Icon-based step identification
- Color-coded information boxes
- Mock data and examples
- Responsive layout for all screens

## Integration Points

### 1. Dashboard Banner (First-Time Users)
```typescript
// Shows on first login, can be dismissed
{showTutorialBanner && (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600">
    <button onClick={() => navigate("/merchant/tutorial")}>
      Commencer le tutoriel
    </button>
    <button onClick={() => setShowTutorialBanner(false)}>
      Plus tard
    </button>
  </div>
)}
```

### 2. Direct Access Route
- URL: `/merchant/tutorial`
- Protected route (requires authentication)
- Can be accessed anytime from settings

### 3. Auto-Redirect After Signup
```typescript
// After delivery company onboarding
localStorage.setItem("merchant_tutorial_completed", "true");
navigate("/merchant/dashboard");
```

## Mock Data Examples

### Exchange Request Example
```json
{
  "product": "T-Shirt Nike Taille L",
  "reason": "Taille incorrecte",
  "description": "J'ai besoin d'une taille M",
  "video": "Jointe (30s)"
}
```

### Chat Conversation Example
```
Client: Est-ce que la taille M est disponible?
You: Oui, nous avons la taille M en stock!
```

### Notifications Example
- ✅ Nouvelle demande d'échange - Client: Ahmed Ben Ali
- 🔵 Échange validé - Code: EXC-2024-001
- 🟣 En cours de livraison - Livreur assigné
- 🟢 Échange terminé - Client satisfait ⭐⭐⭐⭐⭐

## Files Structure

```
src/pages/merchant/
├── Tutorial.tsx              # Main tutorial component
└── Dashboard.tsx             # Integrated banner

src/App.tsx                   # Route configuration

TUTORIAL_FEATURE.md           # This documentation
```

## Usage

### For New Merchants
1. Complete signup at `/signup`
2. Complete delivery onboarding at `/merchant/onboarding`
3. See tutorial banner on dashboard
4. Click "Commencer le tutoriel"
5. Follow 7-step guide
6. Return to dashboard

### For Existing Merchants
1. Can access via settings (future feature)
2. Can reset tutorial completion:
   ```javascript
   localStorage.removeItem("merchant_tutorial_completed");
   ```

## Customization

### Adding New Steps
Edit `src/pages/merchant/Tutorial.tsx`:

```typescript
const steps: TutorialStep[] = [
  // ... existing steps
  {
    id: 8,
    title: "New Feature",
    description: "Description here",
    icon: YourIcon,
    content: (
      <div>
        {/* Your content */}
      </div>
    ),
  },
];
```

### Changing Colors
The tutorial uses a gradient theme:
- Primary: `from-blue-600 to-purple-600`
- Success: `green-600`
- Warning: `amber-600`
- Info: `blue-50`

### Modifying Mock Data
Update the examples in each step's content section to match your actual data patterns.

## Benefits

### For Merchants
- ✅ **Quick Onboarding**: 5-minute interactive guide
- ✅ **Visual Learning**: Screenshots and diagrams
- ✅ **Self-Paced**: Can skip or review anytime
- ✅ **Comprehensive**: Covers all major features
- ✅ **Confidence Building**: Reduces support tickets

### For Platform
- ✅ **Reduced Support**: Self-service learning
- ✅ **Better Adoption**: Merchants understand features
- ✅ **Professional Image**: Polished onboarding
- ✅ **Scalable**: No manual training needed

## Metrics to Track

### Completion Rate
```javascript
const completed = localStorage.getItem("merchant_tutorial_completed");
// Track percentage of merchants who complete tutorial
```

### Step Drop-off
```javascript
// Track which steps users skip most
// Identify confusing sections
```

### Time Spent
```javascript
// Average time per step
// Total tutorial duration
```

## Future Enhancements

### Planned Features
- [ ] Video tutorials embedded in steps
- [ ] Interactive quiz after each section
- [ ] Certificate of completion
- [ ] Tooltip system for in-app guidance
- [ ] Contextual help bubbles
- [ ] Search functionality for specific topics
- [ ] Multi-language support
- [ ] Mobile-optimized version

### Advanced Features
- [ ] Personalized tutorial based on merchant type
- [ ] A/B testing different tutorial flows
- [ ] Analytics dashboard for tutorial performance
- [ ] Gamification (badges, points)
- [ ] Community forum integration

## Testing

### Manual Testing Checklist
- [ ] All 7 steps load correctly
- [ ] Navigation buttons work (Previous/Next)
- [ ] Progress bar updates accurately
- [ ] Skip button dismisses tutorial
- [ ] Completion redirects to dashboard
- [ ] Banner shows for new users only
- [ ] Banner can be dismissed
- [ ] Tutorial can be re-accessed
- [ ] Mobile responsive design
- [ ] All icons and images load

### Test Scenarios

#### New Merchant Flow
1. Sign up as new merchant
2. Complete delivery onboarding
3. See tutorial banner on dashboard
4. Complete full tutorial
5. Verify `localStorage` flag is set
6. Refresh page - banner should not appear

#### Returning User
1. Clear `localStorage.merchant_tutorial_completed`
2. Refresh dashboard
3. Banner should appear again
4. Click "Plus tard"
5. Banner should dismiss
6. Flag should be set

#### Navigation Test
1. Start tutorial
2. Navigate through all steps
3. Use Previous button to go back
4. Use step indicators to jump
5. Complete tutorial
6. Verify redirect to dashboard

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Color contrast ratios meet WCAG standards
- Focus indicators visible
- Skip links available

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy-loaded component
- Minimal bundle size impact
- No external dependencies
- Fast initial render
- Smooth transitions

## Troubleshooting

### Tutorial Not Showing
1. Check `localStorage.getItem("merchant_tutorial_completed")`
2. Clear the flag to force display
3. Verify authentication state

### Navigation Not Working
1. Check React Router configuration
2. Verify protected route setup
3. Check console for errors

### Images Not Loading
1. Verify public folder structure
2. Check image paths
3. Ensure logos are in `public/delivery-logos/`

## Support

For issues or questions:
- Check browser console for errors
- Verify localStorage is enabled
- Test in incognito mode
- Review network tab for failed requests
