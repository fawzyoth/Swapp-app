# Logo Updates - Delivery Company Selection

## Changes Made

### 1. Removed Biased Content
- ❌ Removed emoji icons (🚚, 📦, 📮, ⚙️)
- ❌ Removed marketing descriptions
- ❌ Removed feature lists that could influence decisions
- ✅ Now shows only company logos and names

### 2. Updated Delivery Companies
Replaced generic companies with actual Tunisian delivery partners:

**Before:**
- JAX Delivery
- Aramex
- Tunisia Post
- Other/Manual

**After:**
- JAX Delivery
- Navex
- Vitex
- Tunisia Post
- Other/Manual

### 3. Logo Integration
All logos are now displayed from `public/delivery-logos/`:

```
public/delivery-logos/
├── Logo_First-e1692977453756.png          (JAX Delivery)
├── navex.png                               (Navex)
├── vitex_logo-1.png                        (Vitex)
├── Group_30-removebg-preview-768x224.png   (Tunisia Post)
└── WhatsApp_Image_2025-06-12...png         (Other/Manual)
```

### 4. UI Changes
- **Grid Layout**: Changed to 2 columns (mobile) / 3 columns (desktop)
- **Logo Display**: 20px height container with centered, responsive logos
- **Minimalist Design**: Clean card layout with only logo + name
- **Selection Indicator**: Blue checkmark in top-right corner when selected
- **No Descriptions**: Completely neutral presentation

### 5. Mock API Keys
Added mock keys for all new companies:
- **JAX Delivery**: Real JWT token (production-ready)
- **Navex**: `NAVEX_API_KEY_DEMO_123456789`
- **Vitex**: `VITEX_API_KEY_DEMO_987654321`
- **Tunisia Post**: `TUNISIA_POST_API_KEY_DEMO_111222333`

## Files Modified

1. **src/pages/merchant/Onboarding.tsx**
   - Updated `DeliveryCompany` interface (removed description, features, changed logo to logoPath)
   - Updated company list with actual logos
   - Changed rendering to show only logos without features
   - Updated summary section with logo display

2. **public/delivery-logos/** (new folder)
   - Copied all logos from `logos/` folder
   - Accessible via `/delivery-logos/` path

3. **MERCHANT_ONBOARDING.md**
   - Updated documentation to reflect new companies
   - Updated mock API keys list
   - Updated customization guide

## Benefits

### For Merchants
- ✅ **Unbiased Selection**: No marketing influence in decision
- ✅ **Familiar Brands**: See actual company logos they know
- ✅ **Quick Recognition**: Visual identification is faster
- ✅ **Professional**: Clean, business-like presentation

### For Platform
- ✅ **Neutral Position**: Don't appear to favor any company
- ✅ **Scalable**: Easy to add new delivery partners
- ✅ **Professional**: Modern, clean interface
- ✅ **Transparent**: Merchants make informed choices

## Testing

Visit the onboarding page to see the changes:
```
http://localhost:5176/Swapp-app/#/merchant/onboarding
```

**Test Flow:**
1. Sign up as new merchant at `/signup`
2. Complete signup form
3. View Step 1 with logo-only selection
4. Select a delivery company
5. Configure API key (demo mode available)
6. Complete onboarding

## Future Enhancements

### Potential Additions
- [ ] Add company website links (optional, bottom of page)
- [ ] Add comparison table (separate page, if needed)
- [ ] Allow merchants to add custom delivery partners
- [ ] Support for multiple delivery partners per merchant
- [ ] Delivery partner performance metrics (internal data only)

### Logo Requirements
When adding new delivery partners:
- **Format**: PNG with transparent background
- **Size**: Recommended max width 200px, max height 80px
- **Quality**: High resolution (2x for retina displays)
- **Naming**: Use company name in lowercase with hyphens
  - Example: `new-delivery-company.png`

## Rollback

If you need to revert to the previous version:
```bash
git checkout HEAD~1 -- src/pages/merchant/Onboarding.tsx
git checkout HEAD~1 -- MERCHANT_ONBOARDING.md
rm -rf public/delivery-logos/
```

## Notes

- All existing merchants with saved delivery companies will continue to work
- Database schema remains unchanged
- Mock API keys are for demo purposes only
- Real API keys should be obtained from each delivery partner
- The "Other/Manual" option uses a generic placeholder logo (can be updated)
