import React from "react";
import styles from "./Footer.module.scss"
export default function Footer(){
    return (
        <>
            <div className={styles.footerBorder}></div>
            <div class={`container py-4 ${styles.pageFooter}`}>
            <div class="row">
            <div class="col-lg-4 d-flex flex-column align-items-start">
                <a href="https://viasocket.com/" target="_blank">
                <img src="https://viasocket.com/assets/brand/socket_fav_dark.svg" alt="viasocket" />
                </a>
                <p class="mt-3">
                &copy; 2024 viasocket<br />All rights reserved
                </p>
                <div class="d-flex align-items-center gap-2">
                <span>A product of</span>
                <a target="_blank" href="https://walkover.in" class="d-flex align-items-center ms-2">
                    <img src="https://viasocket.com/assets/brand/walkover.svg"class="me-1" />
                </a>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="row">
                <div class="col-md-3">
                    <h5 class='h6'>Products</h5>
                    <ul class="list-unstyled">
                    <li>
                        <a href="https://viasocket.com/integrations" target="_blank" class="text-dark">Integrations</a>
                    </li>
                    </ul>
                </div>
                
                <div class="col-md-3">
                    <h5 class='h6'>Compare</h5>
                    <ul class="list-unstyled">
                    <li><a href="https://viasocket.com/faq/viasocket-vs-zapier" target="_blank" class="text-dark">Viasocket vs Zapier</a></li>
                    <li><a href="https://viasocket.com/faq/viasocket-vs-make" target="_blank" class="text-dark">Viasocket vs Make</a></li>
                    <li><a href="https://viasocket.com/faq/viasocket-vs-pabbly" target="_blank" class="text-dark">Viasocket vs Pabbly</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5 class='h6'>Company</h5>
                    <ul class="list-unstyled">
                    <li><a href="https://walkover.in/" target="_blank" class="text-dark">About</a></li>
                    <li><a href="https://walkover.in/" target="_blank" class="text-dark">Career</a></li>
                    <li><a href="https://walkover.in/" target="_blank" class="text-dark">Terms of Service</a></li>
                    <li><a href="https://walkover.in/" target="_blank" class="text-dark">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5 class='h6'>Solutions</h5>
                    <ul class="list-unstyled">
                    <li><a href="https://viasocket.com/faq/startup-policy" target="_blank" class="text-dark">Startup Policy</a></li>
                    <li><a href="https://roadmap.viasocket.com/b/n0elp3vg/feature-ideas" target="_blank" class="text-dark">Request a Feature</a></li>
                    <li><a href="https://calendly.com/rpaliwal71/15-mins" target="_blank" class="text-dark">Talk to Sales</a></li>
                    </ul>
                </div>
                </div>
                <div class="row">
                <div class="col-md-3">
                    <h5 class='h6'>Explore</h5>
                    <ul class="list-unstyled">
                    <li><a href="https://viasocket.com/integrations" target="_blank" class="text-dark">App</a></li>
                    <li><a href="https://viasocket.com/experts" target="_blank" class="text-dark">Hire an Expert</a></li>
                    <li><a href="https://viasocket.com/community" target="_blank" class="text-dark">Community</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5 class='h6'>Learn</h5>
                    <ul class="list-unstyled">
                    <li><a href="https://viasocket.com/faq" target="_blank" class="text-dark">University</a></li>
                    <li><a href="https://viasocket.com/blog" target="_blank" class="text-dark">Blog</a></li>
                    <li><a href="https://viasocket.com/faq/case-studies" target="_blank" class="text-dark">Case Studies</a></li>
                    <li><a href="https://viasocket.com/faq/basic-of-viasocket" target="_blank" class="text-dark">Resources</a></li>
                    <li><a href="https://viasocket.com/faq/help-section" target="_blank" class="text-dark">FAQ</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5 class='h6'>Get Help</h5>
                    <ul class="list-unstyled">
                    <li><a href="https://calendly.com/rpaliwal71/15-mins" target="_blank" class="text-dark">Talk to Sales/Support</a></li>
                    <li><a href="https://roadmap.viasocket.com/b/n0elp3vg/feature-ide" target="_blank" class="text-dark">Request a Feature</a></li>
                    <li><a href="https://roadmap.viasocket.com/announcements" target="_blank" class="text-dark">New Release</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5 class='h6'>Social</h5>
                    <ul class="list-unstyled">
                    <li><a href="https://www.linkedin.com/company/viasocket-walkover/" target="_blank" class="text-dark">LinkedIn</a></li>
                    <li><a href="https://www.youtube.com/@viasocket" target="_blank" class="text-dark">YouTube</a></li>
                    <li><a href="https://x.com/viasocket?mx=2" target="_blank" class="text-dark">Twitter</a></li>
                    <li><a href="https://www.instagram.com/walkover.inc/?igsh=MWEyZnptZmw3Z3phOQ%3D%3D" target="_blank" class="text-dark">Instagram</a></li>
                    </ul>
                </div>
                </div>
            </div>
            </div>
        </div>
      </>
    )
}