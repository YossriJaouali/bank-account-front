import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AlertDialogComponent} from './alert-dialog.component';
import {By} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('AlertDialogComponent', () => {
    let component: AlertDialogComponent;
    let fixture: ComponentFixture<AlertDialogComponent>;
    const mockDialogRef = {
        close: jasmine.createSpy('close')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AlertDialogComponent],
            providers: [{provide: MatDialogRef, useValue: mockDialogRef},
                {provide: MAT_DIALOG_DATA, useValue: {data: {message: 'The amount should not be greater than the balance'}}}
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the alert modal', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('button'));
        button.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();
        expect(mockDialogRef.close).toHaveBeenCalled();
    }));
});
