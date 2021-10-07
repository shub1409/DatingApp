import { query } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
@ViewChild('memberTabs', {static: true}) memberTabs : TabsetComponent;
member: Member;
galleryOptions: NgxGalleryOptions[];
galleryImages: NgxGalleryImage[];
activeTab: TabDirective;
messages: Message[] = [];
user : User;

  constructor(private memberService:MembersService, private route: ActivatedRoute,
    private messageService: MessageService, private toastr: ToastrService,
    public presence: PresenceService, private accountService: AccountService,
    private router: Router) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    })

    this.route.queryParams.subscribe(params => {
      params.tab? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [{
      width:'500px',
      height:'500px',
      imagePercent:100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }]

    this.galleryImages = this.getImages();
  }

  getImages() : NgxGalleryImage[] {
    const imageUrls = [];
    for(const photo of this.member.photos){
      imageUrls.push({
        small:photo?.url,
        medium:photo?.url,
        big:photo?.url,
      })
    }
    return imageUrls;
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.userName).subscribe(messages =>{
      this.messages = messages;
    })
  }

  selectTab(tabId: number) {
    //UPDATE QUERY PARAMS
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId}
    });
    
    this.memberTabs.tabs[tabId].active = true;
  }
  
  OnTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
       this.messageService.createHubConnection(this.user, this.member.userName);
    } else{
      this.messageService.stopHubConnection();
    }
  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe(() => {
      this.toastr.success('You have like ' + member.knownAs);
    })
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
