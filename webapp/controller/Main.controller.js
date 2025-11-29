sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("zhrvistorentry.controller.Main", {
        onInit() {
             var oFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "IN");
             this.getOdata("/HeaderSet", "EditModel", oFilter);
             var oHeader ={
                        editable: true
                    };
             this.getOwnerComponent().getModel("Header").setProperty("/data", oHeader);
             this.getOwnerComponent().getModel("Header").refresh(true);
        },
        getRouter: function () {
            return this.getOwnerComponent().getRouter()
        },
        getModel: function (e) {
            return this.getView().getModel(e)
        },
        setModel: function (e, t) {
            return this.getView().setModel(e, t)
        },
        showBusy: function (bBusy) {
            if (bBusy) {
                sap.ui.core.BusyIndicator.show(0);
            } else {
                sap.ui.core.BusyIndicator.hide();
            }
        },
        getText: function (sProperty, aArgs) {
            if (!this._oResourceBundle) {
                this._oResourceBundle = this.getModel("i18n").getResourceBundle();
            }
            return this._oResourceBundle.getText(sProperty, aArgs);
        },

        getResourceBundle: function (sText) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle()
        },
        getOdata: function (surl, smodelname, ofilter,ssearch) {
            if (ofilter === null) {
                this.showBusy(true);
                this.getOwnerComponent().getModel().read(surl, {
                    success: function (oData) {
                        this.showBusy(false);
                        this.getOwnerComponent().getModel(smodelname).setProperty("/results", oData.results);
                        this.getOwnerComponent().getModel(smodelname).refresh(true);

                    }.bind(this),
                    error: function (oError) {
                        this.showBusy(false);
                    }.bind(this)
                });
            } else {
                this.showBusy(true);
                if(ssearch !== null && ssearch !==undefined){
                    this.getOwnerComponent().getModel().read(surl, {
                    filters: [ofilter],
                    urlParameters: {
                    "search": ssearch
                },
                    success: function (oData) {
                        this.showBusy(false);
                        this.getOwnerComponent().getModel(smodelname).setProperty("/results", oData.results);
                        this.getOwnerComponent().getModel(smodelname).refresh(true);
                    }.bind(this),
                    error: function (oError) {
                        this.showBusy(false);
                    }.bind(this)
                });
                }else{
                    this.getOwnerComponent().getModel().read(surl, {
                    filters: [ofilter],
                    success: function (oData) {
                        this.showBusy(false);
                        this.getOwnerComponent().getModel(smodelname).setProperty("/results", oData.results);
                        this.getOwnerComponent().getModel(smodelname).refresh(true);
                    }.bind(this),
                    error: function (oError) {
                        this.showBusy(false);
                    }.bind(this)
                });
                }
                
            }
        },
         updateSerialNo: function (sText) {
            var sTxt = "";
            if (sText !== undefined && sText !== "" && sText !== "0") {
                sTxt = sText.replace(/^0+/, '');
            }
            return sTxt;
        },
        onOpenSeq: function (oEvent) {
            if (!this.Seq) {
                this.Seq = sap.ui.xmlfragment("zhrvistorentry.fragment.Seq", this);
                this.getView().addDependent(this.Seq);
            };

            this.Seq.open();
            this.Seq.getModel().refresh(true);
        },

        onOpenHostName: function (oEvent) {
            if (!this.HostName) {
                this.HostName = sap.ui.xmlfragment("zhrvistorentry.fragment.HostName", this);
                this.getView().addDependent(this.HostName);
            };

            this.HostName.open();
            this.HostName.getModel().refresh(true);
        },

        _handleValueHelpSearchSeq: function (oEvent) {
            var sValue = evt.getParameter("value");
            var oFilter = new sap.ui.model.Filter("Seq", sap.ui.model.FilterOperator.EQ, sValue);
            evt.getSource().getBinding("items").filter([oFilter]);
        },

        _handleValueHelpConfSeq: function (evt) {
          var oSelectedItem = evt.getParameter("selectedItem");
            if (oSelectedItem) {
                 var oFilter = new sap.ui.model.Filter("Seq", sap.ui.model.FilterOperator.EQ, evt.getParameter("selectedItem").getProperty("title"));
                 this.getOdata("/HeaderSet", "EditModel", oFilter);

             this.getView().getModel("Header").getData().data.editable = false;
             this.getView().getModel("Header").refresh(true);
            }
            evt.getSource().getBinding("items").filter([]);
        },

        _handleValueHelpSearchHostName: function (evt) {
            var sValue = evt.getParameter("value");
            var oFilter = new sap.ui.model.Filter("HostNo", sap.ui.model.FilterOperator.EQ, sValue);
            evt.getSource().getBinding("items").filter([oFilter]);
        },
        
        _handleValueHelpConfHostName: function (evt) {
          var oSelectedItem = evt.getParameter("selectedItem");
            if (oSelectedItem) {
                var oFilter = new sap.ui.model.Filter("HostNo", sap.ui.model.FilterOperator.EQ, evt.getParameter("selectedItem").getProperty("title"));
                 this.getOdata("/HostDetailsSet", "EditModel", oFilter);
            }
            evt.getSource().getBinding("items").filter([]);
        },
        onvalidation: function (evt) {
             var oPayload = this.getView().getModel("EditModel").getData().results[0];
             var bflag = true;
            if(oPayload.HostNo === '00000000'){
                MessageBox.error("Host Number is mandatory");
                bflag = false;
            }else if(oPayload.HostDate  === null){
                MessageBox.error("Host Date is mandatory");
                bflag = false;
            }
            else if(oPayload.Status  === ""){
                MessageBox.error("Host Status is mandatory");
                bflag = false;
            }
             else if(oPayload.VisitorName  === ""){
                MessageBox.error("Visitor Name is mandatory");
                bflag = false;
            }
             else if(oPayload.DateOfVisit  === ""){
                MessageBox.error("Date Of Visit is mandatory");
                bflag = false;
            }
             else if(oPayload.VisitorStatus  === ""){
                MessageBox.error("Visitor Status is mandatory");
                bflag = false;
            }
             else if(oPayload.PurposeOfVisit  === ""){
                MessageBox.error("Purpose Of Visit is mandatory");
                bflag = false;
            }
             else if(oPayload.Arrangement  === ""){
                MessageBox.error("Special Arrangement Required is mandatory");
                bflag = false;
            }else{
                var fromdate = new Date(oPayload.DateOfVisit);
                if(oPayload.VisitTo !== null && oPayload.VisitTo !== undefined && oPayload.VisitTo !== ''){
                    var todate = new Date(oPayload.VisitTo);
                    if(fromdate > todate){
                         MessageBox.error("Visit From cannot be greater than Visit To");
                         bflag = false;
                    }
                }
                
            }
             return bflag ;
        },
        onsave: function (evt) {
            var bflag = this.onvalidation();
            if(bflag){
            this.showBusy(true);
            MessageBox.success("Confirm to Save?", {
                actions: ["OK", "Cancel"],
                onClose: (sAction) => {
                    if (sAction === "OK") {
                        this.onsaveaction("");
                    }
                },
            });         
                
            }
        },
        ondelete: function (evt) {
            this.showBusy(true);
            MessageBox.success("Confirm to Delete?", {
                actions: ["OK", "Cancel"],
                onClose: (sAction) => {
                    if (sAction === "OK") {
                        this.onsaveaction("X");
                    }
                },
            });
        },

        onsaveaction: function (deleteFlag,oPayload) {
            var oPayload = this.getView().getModel("EditModel").getData().results[0];
            if(deleteFlag === 'X'){
                oPayload.ActionFlag = true;
            }
            if(oPayload.Seq === '00000000'){
                oPayload.Seq = '';
            }
            delete oPayload.__metadata
            debugger;
            this.getModel().create("/HeaderSet", oPayload, {
                method: "POST",
                success: function (oData) {
                    this.showBusy(false);
                    debugger;
                    var sSrno = oData.Seq;
                    var oData1 = [];
                    oData1.push(oData);
                    if (sSrno !== '' &&   oData.ActionFlag === false) {
                        var sMsg = '';
                        sSrno = sSrno.replace(/^0+/, '');
                        sMsg = "Seq No:" + sSrno + " saved Successfully";    
                         MessageBox.success(sMsg, {
                            actions: ["OK"],
                            onClose: (sAction) => {
                                if (sAction === "OK") {
                                    this.getModel("EditModel").setProperty("/results",  oData1);
                                    this.getView().getModel("Header").getData().data.editable = false;
                                    this.getView().getModel("Header").refresh(true);
                                }
                            },
                        });                    
                    }else{
                        var sMsg = '';
                        sSrno = sSrno.replace(/^0+/, '');
                        sMsg = "Seq No:" + sSrno + " deleted Successfully";    
                         MessageBox.success(sMsg, {
                            actions: ["OK"],
                            onClose: (sAction) => {
                                if (sAction === "OK") {
                                   location.reload();
                                    // this.getModel("EditModel").setProperty("/results",  oData1);
                                    // this.getView().getModel("Header").getData().data.editable = false;
                                    // this.getView().getModel("Header").refresh(true);
                                }
                            },
                        });
                    }
                   
                }.bind(this),
                error: function (oError) {
                    this.showBusy(false);
                }.bind(this)
            });
        },
    });
});