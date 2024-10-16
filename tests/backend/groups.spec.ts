import { test, expect } from '@playwright/test';

let imageSet = new Set<number>;
let count = 0;
test.describe('Groups route is correct', async () => {
    // Kills two birds with one stone, populates the imageSet and count as well as checks that the home page is properly constructed
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/api/groups');

        // Gets the entire Groups object and turns it into JSON so it can be keyed into as an object
        const groupsObj = await page.getByText('Groups').innerText().then(res => JSON.parse(Object(res)))

        for (const group of groupsObj.Groups) {
            expect(group.id).toBeTruthy()
            expect(group.id).toBeGreaterThan(0)
            expect(group.organizerId).toBeTruthy()
            expect(group.organizerId).toBeGreaterThan(0)
            expect(group.about).toBeTruthy()
            expect(group.type).toBeTruthy()
            expect(typeof group.private).toBe(typeof true)
            expect(group.city).toBeTruthy()
            expect(group.state).toBeTruthy()
            expect(group.createdAt).toBeTruthy()
            expect(group.updatedAt).toBeTruthy()
            expect(group.createdAt <= group.updatedAt).toBeTruthy()
            expect(group.numMembers).toBeGreaterThan(0)
            if (group.previewImage) {
                expect(group.previewImage).toContain('http')
                imageSet.add(group.id)
            }
            count++
        }
    })

    test('/groups/:groupId route is properly set up', async ({ page }) => {

        for (let i = 1; i < count; i++) {
            await page.goto(`http://localhost:8000/api/groups/${i}`);
            const group = await page.getByText('Group').innerText().then(res => JSON.parse(res))
            expect(group.GroupImages).toBeTruthy()
            expect(group.GroupImages).toBeInstanceOf(Array)
            const previewTrack = new Array<boolean>;
            if (group.GroupImages.length)
                for (const groupImage of group.GroupImages) {
                    expect(groupImage.id).toBeGreaterThan(0)
                    expect(groupImage.url).toContain('http')
                    expect(typeof groupImage.preview).toBe(typeof true)
                    previewTrack.push(groupImage.preview)
                }
            if (imageSet.has(group.id)) {
                expect(previewTrack).toContain(true)
            }
            expect(group.Organizer).toBeTruthy()
            expect(group.Organizer).toBeInstanceOf(Object)
            expect(group.Organizer.id).toBeGreaterThan(0)
            expect(group.Organizer.firstName).toBeTruthy()
            expect(typeof group.Organizer.firstName).toBe(typeof 'string')
            expect(group.Organizer.lastName).toBeTruthy()
            expect(typeof group.Organizer.lastName).toBe(typeof 'string')
            expect(group.Organizer.email).toBeTruthy()
            expect(typeof group.Organizer.email).toBe(typeof 'string')
            expect(group.Organizer.hashedPassword).toBeFalsy()
            expect(group.Venues).toBeInstanceOf(Array)
            if (group.Venues.length) {
                expect(group.Venues[0]).toBeInstanceOf(Object)
                for (const venue of group.Venues) {
                    expect(venue.id).toBeTruthy()
                    expect(venue.id).toBeGreaterThan(0)
                    expect(venue.groupId).toBe(group.id)
                    expect(venue.address).toBeTruthy()
                    expect(typeof venue.address).toBe(typeof 'string')
                    expect(venue.state).toBeTruthy()
                    expect(typeof venue.state).toBe(typeof 'string')
                    expect(venue.city).toBeTruthy()
                    expect(typeof venue.city).toBe(typeof 'string')
                    expect(venue.lat).toBeTruthy()
                    expect(typeof venue.lat).toBe(typeof 1)
                    expect(venue.lat).toBeLessThanOrEqual(87)
                    expect(venue.lat).toBeGreaterThanOrEqual(-87)
                    expect(venue.lng).toBeTruthy()
                    expect(typeof venue.lng).toBe(typeof 1)
                    expect(venue.lng).toBeLessThanOrEqual(180)
                    expect(venue.lng).toBeGreaterThanOrEqual(-180)
                }
            }
        }
        await page.goto(`http://localhost:8000/api/groups/${count + 1}`);
        const invalidPage = await page.getByText('message').innerText().then(res => JSON.parse(Object(res)))
        expect(invalidPage.message).toBe('Group Not Found')
    })
})