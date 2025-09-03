# Leave Management Dashboard

A modern, responsive web application for managing employee leave settings and policies. Built with HTML, CSS, and Bootstrap 5.

## Features

### Header Section
- **Hamburger Menu**: Navigation toggle button
- **All Candidates Dropdown**: Employee selection dropdown
- **Search Bar**: Global search functionality
- **Notification Icons**: 
  - Bell icon with notification count (13)
  - Tools/Settings icon
  - Envelope icon with message count (13)

### Navigation Tabs
- **Leave Settings** (Active - highlighted in yellow)
- **Leave Recall**
- **Leave History**
- **Relief Officers**

### Create Leave Settings Panel
- Leave Plan Name input
- Duration (days) input
- Leave Recall activation dropdown
- Leave bonus activation dropdown
- Bonus percentage input
- Leave allocation selection
- Reason for recall textarea
- Create button

### Manage Leave Settings Panel
- Table displaying existing leave plans:
  - Maternity (60 days)
  - Sick (14 days)
  - Compassionate (30 days)
  - Exam (20 days)
  - Paternity (60 days)
  - Casual (10 days)
  - Actions dropdown for each plan

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling and responsive design
- **Bootstrap 5**: UI components and grid system
- **Bootstrap Icons**: Icon library for UI elements

## Color Scheme

- **Background**: Light blue (#e3f2fd)
- **Primary Buttons**: Dark blue (#1976d2)
- **Active Tab**: Yellow (#ffc107)
- **Success Button**: Green (#4caf50)
- **Notification Badges**: Red (#f44336)
- **Content Panels**: White with subtle shadows

## Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Getting Started

1. **Download Files**: Ensure you have all three files:
   - `index.html`
   - `styles.css`
   - `README.md`

2. **Open in Browser**: Double-click `index.html` or open it in your preferred web browser

3. **No Installation Required**: The application runs entirely in the browser using CDN-hosted Bootstrap

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Internet Explorer 11+

## Customization

### Adding New Leave Plans
1. Fill out the form in the "Create Leave Settings" panel
2. Click the "Create" button
3. The new plan will appear in the "Manage Leave Settings" table

### Modifying Existing Plans
1. Click the dropdown arrow in the Actions column
2. Select "Edit" or "Delete" as needed

### Styling Changes
- Modify `styles.css` to change colors, fonts, or spacing
- Update Bootstrap classes in `index.html` for layout changes

## File Structure

```
Dashboard/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
└── README.md           # This documentation file
```

## Dependencies

- Bootstrap 5.3.0 (CDN)
- Bootstrap Icons 1.11.0 (CDN)

## License

This project is open source and available for personal and commercial use.

## Support

For questions or issues, please refer to the Bootstrap documentation or modify the code as needed for your specific requirements. 