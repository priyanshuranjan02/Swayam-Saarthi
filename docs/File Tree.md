# File Tree: SwayamSaarthi

**Generated:** 2/14/2026, 8:28:01 PM
**Root Path:** `d:\SwayamSaarthi`

```
├── 📁 .github
│   └── 📁 appmod
│       └── 📁 appcat
├── 📁 Backend
│   ├── 📁 postman
│   │   └── ⚙️ swayam-saarthi.postman.json
│   ├── 📁 src
│   │   ├── 📁 config
│   │   │   ├── 📄 db.js
│   │   │   ├── 📄 env.js
│   │   │   └── 📄 firebase.js
│   │   ├── 📁 controllers
│   │   │   ├── 📄 adminController.js
│   │   │   ├── 📄 authController.js
│   │   │   ├── 📄 bookingController.js
│   │   │   ├── 📄 driverController.js
│   │   │   ├── 📄 paymentController.js
│   │   │   └── 📄 userController.js
│   │   ├── 📁 middleware
│   │   │   ├── 📄 authMiddleware.js
│   │   │   ├── 📄 errorMiddleware.js
│   │   │   ├── 📄 roleMiddleware.js
│   │   │   └── 📄 validateMiddleware.js  # Input validation
│   │   ├── 📁 models
│   │   │   ├── 📄 Admin.js
│   │   │   ├── 📄 Booking.js
│   │   │   ├── 📄 Driver.js
│   │   │   ├── 📄 Payment.js
│   │   │   └── 📄 User.js
│   │   ├── 📁 routes
│   │   │   ├── 📄 adminRoutes.js
│   │   │   ├── 📄 authRoutes.js
│   │   │   ├── 📄 bookingRoutes.js
│   │   │   ├── 📄 driverRoutes.js
│   │   │   ├── 📄 paymentRoutes.js
│   │   │   └── 📄 userRoutes.js
│   │   ├── 📁 services
│   │   │   ├── 📄 bookingService.js      # Core booking logic
│   │   │   ├── 📄 driverService.js       # Driver availability logic
│   │   │   └── 📄 notificationService.js # Notifications (future-ready)
│   │   ├── 📁 utils
│   │   │   ├── 📄 calculateFare.js
│   │   │   ├── 📄 distanceHelper.js
│   │   │   ├── 📄 generateToken.js
│   │   │   ├── 📄 hashPassword.js
│   │   │   └── 📄 responseHelper.js
│   │   ├── 📁 validations
│   │   │   ├── 📄 authValidation.js
│   │   │   ├── 📄 bookingValidation.js
│   │   │   └── 📄 driverValidation.js
│   │   ├── 📄 app.js
│   │   └── 📄 server.js
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── ⚙️ package-lock.json
│   └── ⚙️ package.json
├── 📁 Frontend
│   ├── 📁 public
│   │   ├── 🖼️ SwayamSaarthi-Logo.png
│   │   ├── 📄 favicon.ico
│   │   ├── 🖼️ placeholder.svg
│   │   └── 📄 robots.txt
│   ├── 📁 src
│   │   ├── 📁 components
│   │   │   ├── 📁 auth
│   │   │   │   └── 📄 ProtectedRoute.tsx
│   │   │   ├── 📁 booking
│   │   │   │   ├── 📄 DriverCard.tsx
│   │   │   │   └── 📄 StepIndicator.tsx
│   │   │   ├── 📁 layout
│   │   │   │   ├── 📄 Footer.tsx
│   │   │   │   ├── 📄 Navbar.tsx
│   │   │   │   └── 📄 PageLayout.tsx
│   │   │   ├── 📁 ui
│   │   │   │   ├── 📄 accordion.tsx
│   │   │   │   ├── 📄 alert-dialog.tsx
│   │   │   │   ├── 📄 alert.tsx
│   │   │   │   ├── 📄 aspect-ratio.tsx
│   │   │   │   ├── 📄 avatar.tsx
│   │   │   │   ├── 📄 badge.tsx
│   │   │   │   ├── 📄 breadcrumb.tsx
│   │   │   │   ├── 📄 button.tsx
│   │   │   │   ├── 📄 calendar.tsx
│   │   │   │   ├── 📄 card.tsx
│   │   │   │   ├── 📄 carousel.tsx
│   │   │   │   ├── 📄 chart.tsx
│   │   │   │   ├── 📄 checkbox.tsx
│   │   │   │   ├── 📄 collapsible.tsx
│   │   │   │   ├── 📄 command.tsx
│   │   │   │   ├── 📄 context-menu.tsx
│   │   │   │   ├── 📄 dialog.tsx
│   │   │   │   ├── 📄 drawer.tsx
│   │   │   │   ├── 📄 dropdown-menu.tsx
│   │   │   │   ├── 📄 form.tsx
│   │   │   │   ├── 📄 hover-card.tsx
│   │   │   │   ├── 📄 input-otp.tsx
│   │   │   │   ├── 📄 input.tsx
│   │   │   │   ├── 📄 label.tsx
│   │   │   │   ├── 📄 menubar.tsx
│   │   │   │   ├── 📄 navigation-menu.tsx
│   │   │   │   ├── 📄 pagination.tsx
│   │   │   │   ├── 📄 popover.tsx
│   │   │   │   ├── 📄 progress.tsx
│   │   │   │   ├── 📄 radio-group.tsx
│   │   │   │   ├── 📄 resizable.tsx
│   │   │   │   ├── 📄 scroll-area.tsx
│   │   │   │   ├── 📄 select.tsx
│   │   │   │   ├── 📄 separator.tsx
│   │   │   │   ├── 📄 sheet.tsx
│   │   │   │   ├── 📄 sidebar.tsx
│   │   │   │   ├── 📄 skeleton-card.tsx
│   │   │   │   ├── 📄 skeleton.tsx
│   │   │   │   ├── 📄 slider.tsx
│   │   │   │   ├── 📄 sonner.tsx
│   │   │   │   ├── 📄 switch.tsx
│   │   │   │   ├── 📄 table.tsx
│   │   │   │   ├── 📄 tabs.tsx
│   │   │   │   ├── 📄 textarea.tsx
│   │   │   │   ├── 📄 toast.tsx
│   │   │   │   ├── 📄 toaster.tsx
│   │   │   │   ├── 📄 toggle-group.tsx
│   │   │   │   ├── 📄 toggle.tsx
│   │   │   │   ├── 📄 tooltip.tsx
│   │   │   │   └── 📄 use-toast.ts
│   │   │   ├── 📄 NavLink.tsx
│   │   │   └── 📄 ThemeToggle.tsx
│   │   ├── 📁 contexts
│   │   │   ├── 📄 AuthContext.tsx
│   │   │   ├── 📄 BookingContext.tsx
│   │   │   └── 📄 ThemeContext.tsx
│   │   ├── 📁 hooks
│   │   │   ├── 📄 use-mobile.tsx
│   │   │   └── 📄 use-toast.ts
│   │   ├── 📁 lib
│   │   │   ├── 📄 api.ts
│   │   │   ├── 📄 socket.ts
│   │   │   └── 📄 utils.ts
│   │   ├── 📁 pages
│   │   │   ├── 📄 AdminAnalyticsCharts.tsx
│   │   │   ├── 📄 AdminBookingsTable.tsx
│   │   │   ├── 📄 AdminDashboard.tsx
│   │   │   ├── 📄 AdminStatCard.tsx
│   │   │   ├── 📄 BookingConfirmation.tsx
│   │   │   ├── 📄 CreateBooking.tsx
│   │   │   ├── 📄 DriverBookingHistory.tsx
│   │   │   ├── 📄 DriverDashboard.tsx
│   │   │   ├── 📄 DriverEarnings.tsx
│   │   │   ├── 📄 Index.tsx
│   │   │   ├── 📄 Login.tsx
│   │   │   ├── 📄 NotFound.tsx
│   │   │   ├── 📄 Payment.tsx
│   │   │   ├── 📄 RegisterDriver.tsx
│   │   │   ├── 📄 RegisterUser.tsx
│   │   │   ├── 📄 SelectDriver.tsx
│   │   │   ├── 📄 UserBookingHistory.tsx
│   │   │   └── 📄 UserDashboard.tsx
│   │   ├── 📁 routes
│   │   │   └── 📄 AppRoutes.jsx
│   │   ├── 📁 test
│   │   │   ├── 📄 example.test.ts
│   │   │   └── 📄 setup.ts
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.tsx
│   │   ├── 🎨 index.css
│   │   ├── 📄 main.tsx
│   │   └── 📄 vite-env.d.ts
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── 📄 bun.lockb
│   ├── ⚙️ components.json
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 postcss.config.js
│   ├── 📄 tailwind.config.ts
│   ├── ⚙️ tsconfig.app.json
│   ├── ⚙️ tsconfig.json
│   ├── ⚙️ tsconfig.node.json
│   ├── 📄 vite.config.ts
│   └── 📄 vitest.config.ts
├── 📁 docs
│   ├── 📕 api-flow.pdf
│   ├── 📕 er-diagram.pdf
│   ├── 📘 project-report.docx
│   ├── 📘 File Tree.md
│   └── 📕 system-architecture.pdf
├── ⚙️ Full Stack File Structure.ini
└── ⚙️ package.json
```

---
*Generated by FileTree Pro Extension*