import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Loader2,
  Minus,
  Package,
  Info,
  ChevronRight,
  ChevronLeft,
  Check,
  Armchair,
  ExternalLink,
  Map as MapIcon,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import SortToggle, { SortOrder } from "@/components/SortToggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { moveOfferService } from "@/services/moveOfferService";
import { moveRequestService } from "@/services/moveRequestService";
import { addressService } from "@/services/addressService";
import { luggageService } from "@/services/luggageService";
import { tripService } from "@/services/tripService";
import type {
  MoveRequest,
  MoveRequestPopulated,
  MoveOfferPopulated,
  LuggageType,
} from "@/types";
import { populationFactory } from "@/services/populationFactory";
import { getVehicleString, getGoogleMapsAddressLink, getGoogleMapsDirectionsLink } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { AddressAutocomplete, AddressResult } from "@/components/AddressAutocomplete";
import { DateTimePicker } from "@/components/DateTimePicker";

const ClientMoveRequests = () => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState<MoveRequestPopulated | null>(null);
  const [myRequests, setMyRequests] = useState<MoveRequestPopulated[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const sortedRequests = useMemo(() => {
    return [...myRequests].sort((a, b) => {
      const dateA = new Date(a.moveDate).getTime();
      const dateB = new Date(b.moveDate).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [myRequests, sortOrder]);

  const [offersForRequest, setOffersForRequest] = useState<MoveOfferPopulated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Luggage state
  const [luggageTypes, setLuggageTypes] = useState<LuggageType[]>([]);
  const [luggageQuantities, setLuggageQuantities] = useState<Record<number, number>>({});

  // Form state - Pick-up
  const [fromLine1, setFromLine1] = useState("");
  const [fromLine2, setFromLine2] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [fromState, setFromState] = useState("");
  const [fromCountry, setFromCountry] = useState("Canada");
  const [fromPostal, setFromPostal] = useState("");
  const [fromLat, setFromLat] = useState<number | null>(null);
  const [fromLon, setFromLon] = useState<number | null>(null);

  // Form state - Destination
  const [toLine1, setToLine1] = useState("");
  const [toLine2, setToLine2] = useState("");
  const [toCity, setToCity] = useState("");
  const [toState, setToState] = useState("");
  const [toCountry, setToCountry] = useState("Canada");
  const [toPostal, setToPostal] = useState("");
  const [toLat, setToLat] = useState<number | null>(null);
  const [toLon, setToLon] = useState<number | null>(null);

  const [moveDate, setMoveDate] = useState<Date | undefined>(undefined);
  const [maxBudget, setMaxBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [hasFurniture, setHasFurniture] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestBudget = async () => {
    if (!fromLine1 || !fromCity || !toLine1 || !toCity) {
      toast({
        title: "Missing Information",
        description: "Please select both pick-up and destination addresses to get a budget suggestion.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSuggesting(true);
      const addrDataFrom = {
        line1: fromLine1, line2: fromLine2, city: fromCity,
        stateOrProvince: fromState, country: fromCountry,
        postalOrZipCode: fromPostal, latitude: fromLat, longitude: fromLon
      };
      const addrDataTo = {
        line1: toLine1, line2: toLine2, city: toCity,
        stateOrProvince: toState, country: toCountry,
        postalOrZipCode: toPostal, latitude: toLat, longitude: toLon
      };

      const [fromAddr, toAddr] = await Promise.all([
        addressService.createAddress(addrDataFrom),
        addressService.createAddress(addrDataTo),
      ]);

      const response = await tripService.suggestBudget({
        fromAddressId: fromAddr.id,
        toAddressId: toAddr.id,
        hasFurniture: hasFurniture
      });

      if (response && response.suggestedMaxBudget) {
        setMaxBudget(Math.round(response.suggestedMaxBudget).toString());
        toast({
          title: "Budget Suggested",
          description: `Suggested budget is $${Math.round(response.suggestedMaxBudget)} based on ${Math.round(response.distance)}km distance.`,
        });
      }
    } catch (err: any) {
      toast({
        title: "Suggestion Failed",
        description: "Could not calculate budget. Please check your addresses.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchRequests();
    fetchLuggageTypes();
  }, [userId]);

  const fetchRequests = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await moveRequestService.getActiveRequests();
      const populated = await Promise.all(data.map((req) => populationFactory.populateMoveRequest(req)));
      setMyRequests(populated);
    } catch (err) {
      console.error("Failed to load move requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLuggageTypes = async () => {
    try {
      const types = await luggageService.getAllLuggageTypes();
      const sortedTypes = [...types].sort((a, b) => (a.id || 0) - (b.id || 0)).slice(0, 5);
      setLuggageTypes(sortedTypes);
      const initialQuantities: Record<string, number> = {};
      sortedTypes.forEach((t) => {
        const key = String(t.id || t.type || t.luggageTypeEnum);
        initialQuantities[key] = 0;
      });
      setLuggageQuantities(initialQuantities);
    } catch (err) {
      console.error("Failed to load luggage types:", err);
    }
  };

  const handleSelectRequest = async (req: MoveRequest) => {
    const populated = await populationFactory.populateMoveRequest(req);
    setSelected(populated);
    try {
      const offers = await moveOfferService.getOffersByMoveRequest(req.id);
      const populatedOffers = await Promise.all(offers.map((o) => populationFactory.populateMoveOffer(o)));
      setOffersForRequest(Array.isArray(populatedOffers) ? populatedOffers : []);
    } catch {
      setOffersForRequest([]);
    }
  };

  const handleAcceptOffer = async (offerId: number) => {
    try {
      await moveOfferService.acceptOffer(offerId);
      toast({ title: "Offer Accepted", description: "The move offer has been accepted." });
      if (selected) handleSelectRequest(selected);
      fetchRequests();
    } catch {
      toast({ title: "Error", description: "Failed to accept offer.", variant: "destructive" });
    }
  };

  const handleRejectOffer = async (offerId: number) => {
    try {
      await moveOfferService.rejectOffer(offerId);
      toast({ title: "Offer Rejected", description: "The move offer has been rejected." });
      if (selected) handleSelectRequest(selected);
    } catch {
      toast({ title: "Error", description: "Failed to reject offer.", variant: "destructive" });
    }
  };

  const updateLuggageQuantity = (id: string | number, delta: number) => {
    const key = String(id);
    setLuggageQuantities((prev) => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) }));
  };

  const handleEditRequest = (req: MoveRequestPopulated) => {
    setIsEditing(true);
    setCurrentRequestId(req.id);
    setFromLine1(req.fromAddress.line1);
    setFromLine2(req.fromAddress.line2 || "");
    setFromCity(req.fromAddress.city);
    setFromState(req.fromAddress.stateOrProvince);
    setFromCountry(req.fromAddress.country);
    setFromPostal(req.fromAddress.postalOrZipCode);
    setFromLat(req.fromAddress.latitude || null);
    setFromLon(req.fromAddress.longitude || null);
    setToLine1(req.toAddress.line1);
    setToLine2(req.toAddress.line2 || "");
    setToCity(req.toAddress.city);
    setToState(req.toAddress.stateOrProvince);
    setToCountry(req.toAddress.country);
    setToPostal(req.toAddress.postalOrZipCode);
    setToLat(req.toAddress.latitude || null);
    setToLon(req.toAddress.longitude || null);
    setMoveDate(req.moveDate);
    setMaxBudget(String(req.maxBudget));
    setHasFurniture(req.hasFurniture || false);
    const newQtys: Record<string, number> = {};
    luggageTypes.forEach((t) => {
      const key = String(t.id || t.type || t.luggageTypeEnum);
      const entry = req.luggageEntries?.find((le) => le.luggageTypeId === t.id);
      newQtys[key] = entry ? entry.quantity : 0;
    });
    setLuggageQuantities(newQtys);
    setDialogOpen(true);
  };

  const handleCancelRequest = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this move request?")) return;
    try {
      await moveRequestService.cancelMoveRequest(id);
      toast({ title: "Request Cancelled", description: "Your move request has been cancelled." });
      fetchRequests();
      setSelected(null);
    } catch {
      toast({ title: "Error", description: "Failed to cancel move request.", variant: "destructive" });
    }
  };

  const nextStep = () => {
    if (!fromLine1 || !toLine1 || !moveDate || !maxBudget) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const handleSubmitRequest = async () => {
    if (!moveDate) return;
    setIsSubmitting(true);
    try {
      let reqId = currentRequestId;
      const addrFrom = { line1: fromLine1, line2: fromLine2, city: fromCity, stateOrProvince: fromState, country: fromCountry, postalOrZipCode: fromPostal, latitude: fromLat, longitude: fromLon };
      const addrTo = { line1: toLine1, line2: toLine2, city: toCity, stateOrProvince: toState, country: toCountry, postalOrZipCode: toPostal, latitude: toLat, longitude: toLon };

      if (isEditing && selected) {
        await Promise.all([
          addressService.updateAddress(selected.fromAddressId, addrFrom),
          addressService.updateAddress(selected.toAddressId, addrTo),
        ]);
        await moveRequestService.updateMoveRequest(currentRequestId!, {
          clientId: userId!, fromAddressId: selected.fromAddressId, toAddressId: selected.toAddressId,
          moveDate, maxBudget: parseFloat(maxBudget), status: selected.status as any, hasFurniture
        });
      } else {
        const [from, to] = await Promise.all([addressService.createAddress(addrFrom), addressService.createAddress(addrTo)]);
        const newReq = await moveRequestService.createMoveRequest({
          clientId: userId!, fromAddressId: from.id, toAddressId: to.id,
          moveDate, maxBudget: parseFloat(maxBudget), status: "CREATED", hasFurniture
        });
        reqId = newReq.id;
      }

      const luggageToCreate = Object.entries(luggageQuantities).filter(([_, qty]) => qty > 0).map(([key, qty]) => {
        const type = luggageTypes.find((t) => String(t.id || t.type || t.luggageTypeEnum) === key);
        let existingId = isEditing && selected?.luggageEntries?.find(le => le.luggageTypeId === type?.id)?.id || null;
        return { id: existingId, luggageTypeId: type?.id || 0, quantity: qty, luggageType: type?.luggageTypeEnum || type?.type };
      });

      if (reqId) {
        await Promise.all(luggageToCreate.map((entry) => luggageService.createLuggageEntry(reqId!, entry as any)));
      }

      toast({ title: isEditing ? "Request Updated" : "Request Created", description: isEditing ? "Your move request has been updated." : "Your move request has been submitted." });
      setDialogOpen(false);
      resetForm();
      fetchRequests();
    } catch {
      toast({ title: "Error", description: `Failed to ${isEditing ? "update" : "create"} move request.`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false); setCurrentRequestId(null);
    setFromLine1(""); setFromLine2(""); setFromCity(""); setFromState(""); setFromCountry("Canada"); setFromPostal(""); setFromLat(null); setFromLon(null);
    setToLine1(""); setToLine2(""); setToCity(""); setToState(""); setToCountry("Canada"); setToPostal(""); setToLat(null); setToLon(null);
    setMoveDate(undefined); setMaxBudget(""); setNotes(""); setHasFurniture(false);
    const empty: Record<string, number> = {};
    luggageTypes.forEach((t) => empty[String(t.id || t.type || t.luggageTypeEnum)] = 0);
    setLuggageQuantities(empty);
    setStep(1);
  };

  const onFromAddressSelect = (res: AddressResult) => {
    setFromLine1(res.line1); setFromCity(res.city); setFromState(res.stateOrProvince); setFromCountry(res.country); setFromPostal(res.postalOrZipCode); setFromLat(res.latitude); setFromLon(res.longitude);
  };

  const onToAddressSelect = (res: AddressResult) => {
    setToLine1(res.line1); setToCity(res.city); setToState(res.stateOrProvince); setToCountry(res.country); setToPostal(res.postalOrZipCode); setToLat(res.latitude); setToLon(res.longitude);
  };

  return (
    <div className="space-y-6 animate-fade-in text-foreground/90 font-medium">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Move Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your moving requests</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(val) => { setDialogOpen(val); if (!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg h-10 px-6 font-semibold">
              <Plus className="w-4 h-4" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="p-6 border-b bg-background">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">{isEditing ? "Edit Move Request" : "Create Move Request"}</DialogTitle>
                <div className="flex gap-1.5">
                  <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step === 1 ? "bg-primary" : "bg-primary/20"}`} />
                  <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step === 2 ? "bg-primary" : "bg-primary/20"}`} />
                </div>
              </div>
            </DialogHeader>
            <div className="p-6 overflow-y-auto flex-1 bg-background">
              {step === 1 ? (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Pick-up Location</Label>
                      <AddressAutocomplete onAddressSelect={onFromAddressSelect} defaultValue={fromLine1 ? `${fromLine1}, ${fromCity}` : ""} placeholder="Search pick-up address..." />
                    </div>
                    <div className="space-y-3 pt-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Destination</Label>
                      <AddressAutocomplete onAddressSelect={onToAddressSelect} defaultValue={toLine1 ? `${toLine1}, ${toCity}` : ""} placeholder="Search destination address..." />
                    </div>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Move Date</Label>
                      <DateTimePicker date={moveDate} setDate={setMoveDate} placeholder="Select move date" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Budget ($)</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={handleSuggestBudget} disabled={isSuggesting} className="h-6 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/5">
                          {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Suggest"}
                        </Button>
                      </div>
                      <Input type="number" placeholder="500" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="h-11 rounded-xl bg-secondary/30" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2 px-1">
                    <Checkbox id="hasFurniture" checked={hasFurniture} onCheckedChange={(c) => setHasFurniture(c as boolean)} className="rounded-md h-5 w-5 border-primary/30 data-[state=checked]:bg-primary" />
                    <Label htmlFor="hasFurniture" className="text-sm font-semibold cursor-pointer">Includes Furniture (Requires larger vehicle)</Label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                  <div className="flex items-center justify-between px-1"><Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Luggage Items</Label><Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/5" onClick={() => setGuideOpen(true)}><Info className="w-3 h-3" /> Size Guide</Button></div>
                  <div className="grid grid-cols-1 gap-2">
                    {luggageTypes.map((t) => {
                      const key = String(t.id || t.type || t.luggageTypeEnum);
                      return (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/50 group hover:border-primary/30 transition-all">
                          <div className="flex flex-col"><span className="text-sm font-bold">{t.name}</span><span className="text-[10px] text-muted-foreground uppercase">{(t.luggageTypeEnum || t.type || "").replace(/_/g, " ")}</span></div>
                          <div className="flex items-center gap-3 bg-background/80 rounded-xl p-1 border shadow-sm group-hover:bg-background transition-colors">
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => updateLuggageQuantity(key, -1)} disabled={!luggageQuantities[key]}><Minus className="h-3 w-3" /></Button>
                            <span className="text-sm font-bold w-6 text-center">{luggageQuantities[key] || 0}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => updateLuggageQuantity(key, 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2"><Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Notes (Optional)</Label><Textarea placeholder="e.g. Fragile items..." value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 min-h-[80px] rounded-xl bg-secondary/30" /></div>
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-secondary/10 flex gap-3">
              {step === 2 && <Button variant="outline" className="flex-1 h-12 rounded-xl font-semibold" onClick={() => setStep(1)} disabled={isSubmitting}><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>}
              {step === 1 ? <Button className="flex-1 h-12 rounded-xl font-bold shadow-lg" onClick={nextStep}>Continue <ChevronRight className="w-4 h-4 ml-2" /></Button> : <Button className="flex-1 h-12 rounded-xl font-bold shadow-lg" onClick={handleSubmitRequest} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Request <Check className="w-4 h-4 ml-2" /></>}</Button>}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={guideOpen} onOpenChange={setGuideOpen}><DialogContent className="max-w-md rounded-2xl shadow-2xl border-0"><DialogHeader><DialogTitle className="flex items-center gap-2 text-xl font-bold"><Info className="w-5 h-5 text-primary" /> Luggage Size Guide</DialogTitle></DialogHeader><div className="mt-2 rounded-xl border border-border/50 overflow-hidden bg-secondary/10"><Table><TableHeader className="bg-secondary/30"><TableRow className="border-b-border/50"><TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</TableHead><TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Volume</TableHead><TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight</TableHead></TableRow></TableHeader><TableBody>{luggageTypes.map((t) => (<TableRow key={t.id} className="hover:bg-secondary/20 border-b-border/50 last:border-0 transition-colors"><TableCell className="py-4"><div className="flex flex-col"><span className="text-sm font-bold">{t.name}</span><span className="text-[9px] text-muted-foreground uppercase tracking-tight">{(t.luggageTypeEnum || t.type || "").replace(/_/g, " ")}</span></div></TableCell><TableCell className="text-right font-semibold text-sm py-4">{t.volume} m³</TableCell><TableCell className="text-right font-semibold text-sm py-4">{t.weight} kg</TableCell></TableRow>))}</TableBody></Table></div></DialogContent></Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between px-1"><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Active Requests</p><SortToggle order={sortOrder} setOrder={setSortOrder} /></div>
            <div className="space-y-3">{sortedRequests.length === 0 ? <p className="text-sm text-muted-foreground">No move requests yet.</p> : sortedRequests.map((req) => (<Card key={req.id} className={`cursor-pointer transition-all hover:shadow-card-lg border-2 ${selected?.id === req.id ? "border-primary bg-primary/5 shadow-md scale-[1.01]" : "border-transparent shadow-card"}`} onClick={() => handleSelectRequest(req)}><CardContent className="p-4"><div className="flex justify-between items-start mb-2"><p className="font-bold text-sm">{req.fromAddress?.city} → {req.toAddress?.city}</p><StatusBadge status={req.status} /></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> {req.moveDate.toLocaleDateString()}</span><span>•</span><span className="font-bold text-foreground">${req.maxBudget}</span>{req.hasFurniture && <Armchair className="w-3 h-3 text-primary ml-1" />}</div></CardContent></Card>))}</div>
          </div>
          <div className="lg:col-span-2">
            {selected ? (
              <Card className="shadow-sm border-border/50 rounded-xl bg-card overflow-hidden h-full flex flex-col">
                <CardHeader className="py-4 px-6 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 shrink-0"><Package className="w-5 h-5" /></div><div><CardTitle className="text-base font-bold tracking-tight">Move Details</CardTitle><p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Request #{selected.id}</p></div></div><div className="flex items-center gap-2"><Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-bold text-primary hover:bg-primary/5 gap-1.5" asChild title="View Route on Google Maps"><a href={getGoogleMapsDirectionsLink(selected.fromAddress, selected.toAddress)} target="_blank" rel="noopener noreferrer"><MapIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">View Route</span></a></Button>{(selected.status === "CREATED" || selected.status === "OFFER_AVAILABLE") && (<div className="hidden sm:flex items-center gap-2 mr-2"><Button variant="ghost" size="sm" onClick={() => handleEditRequest(selected)} className="h-8 text-xs font-semibold hover:bg-primary/5 hover:text-primary">Edit</Button><Button variant="ghost" size="sm" onClick={() => handleCancelRequest(selected.id)} className="h-8 text-xs font-semibold text-destructive hover:bg-destructive/5">Cancel</Button></div>)}<StatusBadge status={selected.status} /></div></CardHeader>
                <CardContent className="flex-1 overflow-auto p-0 divide-y divide-border/40 text-foreground/90 font-medium">
                  <div className="p-6 bg-background/50"><div className="relative flex flex-col gap-10 pl-10 before:absolute before:left-[15px] before:top-2 before:bottom-10 before:w-[2px] before:bg-border/60 before:rounded-full"><div className="relative"><div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10 ring-offset-2 ring-offset-background z-10" /><div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2"><div className="space-y-0.5"><p className="text-[10px] font-bold uppercase text-primary tracking-widest leading-none mb-1.5">Pick-up</p><p className="text-sm font-bold text-foreground leading-tight">{selected.fromAddress?.line1}</p><p className="text-xs text-muted-foreground mt-0.5">{selected.fromAddress?.city}, {selected.fromAddress?.stateOrProvince}</p></div><Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold text-primary opacity-60 hover:opacity-100" asChild><a href={getGoogleMapsAddressLink(selected.fromAddress)} target="_blank" rel="noopener noreferrer">Maps <ExternalLink className="ml-1 w-2.5 h-2.5" /></a></Button></div></div><div className="relative"><div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-foreground/80 ring-4 ring-foreground/5 ring-offset-2 ring-offset-background z-10" /><div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2"><div className="space-y-0.5"><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-none mb-1.5">Destination</p><p className="text-sm font-bold text-foreground leading-tight">{selected.toAddress?.line1}</p><p className="text-xs text-muted-foreground mt-0.5">{selected.toAddress?.city}, {selected.toAddress?.stateOrProvince}</p></div><Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold text-primary opacity-60 hover:opacity-100" asChild><a href={getGoogleMapsAddressLink(selected.toAddress)} target="_blank" rel="noopener noreferrer">Maps <ExternalLink className="ml-1 w-2.5 h-2.5" /></a></Button></div></div></div></div>
                  <div className="px-6 py-4 flex flex-wrap gap-6 bg-muted/10"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center shadow-sm text-muted-foreground"><Clock className="w-4 h-4" /></div><div><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Scheduled</p><p className="text-xs font-bold mt-0.5">{new Date(selected.moveDate).toLocaleDateString()}</p></div></div><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center shadow-sm text-primary"><span className="text-xs font-black">$</span></div><div><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Budget</p><p className="text-xs font-bold mt-0.5">${selected.maxBudget}</p></div></div>{selected.hasFurniture && (<div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shadow-sm text-primary"><Armchair className="w-4 h-4" /></div><div><p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Furniture</p><p className="text-xs font-bold mt-0.5 text-primary">Included</p></div></div>)}</div>
                  <div className="p-6"><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-4">Luggage Inventory</p><div className="flex flex-wrap gap-2">{selected.luggageEntries?.length ? (selected.luggageEntries.map((l, i) => (<div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-background border border-border/50 shadow-sm ring-1 ring-black/5"><span className="w-5 h-5 flex items-center justify-center bg-primary/10 text-primary rounded-md text-[10px] font-black">{l.quantity}</span><span className="text-[11px] font-bold text-foreground/80">{l.luggageType?.name}</span></div>))) : (<p className="text-xs text-muted-foreground italic">No items listed</p>)}</div></div>
                  <div className="p-6 bg-muted/5 flex-1"><div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">Driver Offers <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black">{offersForRequest.length}</span></h3></div>{offersForRequest.length === 0 ? (<div className="text-center py-8 bg-background border border-dashed border-border/60 rounded-xl"><p className="text-xs font-semibold text-muted-foreground/60">Waiting for driver offers...</p></div>) : (<div className="space-y-3">{offersForRequest.map((offer) => (<div key={offer.id} className="p-4 rounded-xl bg-card border border-border/50 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors uppercase">{offer.driver.user.firstName[0]}{offer.driver.user.lastName[0]}</div><div><p className="text-xs font-bold text-foreground">{offer.driver.user.firstName} {offer.driver.user.lastName}</p><p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{getVehicleString(offer.vehicle)}</p></div></div><div className="flex items-center gap-4"><div className="text-right"><p className="text-base font-black text-primary tracking-tighter leading-none">${offer.price}</p><p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Fixed</p></div><div className="flex items-center gap-2">{offer.status === "OFFER_SENT" && (selected.status === "CREATED" || selected.status === "OFFER_AVAILABLE") ? (<div className="flex items-center gap-2"><Button size="sm" variant="ghost" onClick={() => handleRejectOffer(offer.id)} className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider text-destructive hover:bg-destructive/5 hover:text-destructive">Reject</Button><Button size="sm" onClick={() => handleAcceptOffer(offer.id)} className="h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">Accept</Button></div>) : (<StatusBadge status={offer.status} />)}</div></div></div>))}</div>)}</div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-dashed rounded-xl opacity-60 bg-muted/20 border-border/60"><div className="p-6 rounded-2xl bg-primary/5 mb-4 text-primary/40 ring-1 ring-primary/10 animate-float"><Package className="w-16 h-16" /></div><p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Select a move to inspect</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientMoveRequests;
