package com.food.cart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/shops")
    public String shops() {
        return "shops";
    }

    @GetMapping("/cart")
    public String cart() {
        return "cart";
    }

    @GetMapping("/orders")
    public String orders() {
        return "orders";
    }

    @GetMapping("/owner")
    public String ownerDashboard() {
        return "owner-dashboard";
    }

    @GetMapping("/owner/dashboard")
    public String ownerDashboardAlt() {
        return "owner-dashboard";
    }
}
